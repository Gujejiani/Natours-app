const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync  = require('../utils/catchAsync')
const AppError = require('./../utils/appError')
const sendEmail = require('./../utils/email')
const crypto = require('crypto') 
// const util = require('util')

const {promisify} = require('util')

const signToken = id =>{
    return jwt.sign({ id:id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true

    // remove password from the output
    user.password = undefined
    user.confirmPassword = undefined
    res.cookie('jwt', token, cookieOptions)
    res.status(statusCode).json({
        status: 'success',
        token: token,
        data:{
            user: user
        }
    })
}
exports.signup = catchAsync(async  (req, res, next)=>{
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req?.body?.role
    });
   createSendToken(newUser, 201,  res)
    
})



exports.login = catchAsync( async (req, res,  next) =>{
    const {email, password} = req.body;

    //check if email and password exist
if(!email || !password) {
  return  next(new AppError('please provide email and password', 400))
}
    // check if user exist && if password is correct
 const user = await User.findOne({email}).select('+password')  // we use plus sign to add password       default  it's  disabled 
  
    
    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401))
    }
    createSendToken(user, 200,  res)
  

})

exports.protect = catchAsync( async (req, res, next)=>{

    // 1) Getting token and check if it's there
    let token
    if(req.headers.authorization  && req.headers.authorization.startsWith('Bearer')){
     token  = req.headers.authorization.split(' ')[1]
    }
    //console.log('works ', token)
 
    if(!token){
        return next(new AppError('you are not loggedIn, please authorize', 401)) // 401 not authorized
    }
    // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//   console.log(decoded)
    // 3)  check  if user still exists
 const freshUser  = await  User.findById(decoded.id);
 if(!freshUser){
     return next(new AppError('the user belonging to this token does no longer exist', 401))
 }
    // 4) check if user changed password after the token was issued
 if(freshUser.changedPasswordAfter(decoded.iat)){ // time   decoded returns { id: '614705be2662d13ee4c59a94', iat: 1634454540, exp: 1642230540 }  iat is a time stamp
    return next(new AppError('User recently changes password! please login again', 401))
 }; 
 req.user = freshUser
    next();
})


exports.restrictTo = (...roles)=>{ 
    return (req, res, next)=>{
        // roles ['admin', 'lead-guide']. role='user'  in that case our role doesn't include user, so we are not giving him permission
        if(!roles.includes(req.user.role)){ // we stored user in  req.user in the previous middleware named protect, you can see on line 63 :)  thank to your past version Kakha: 1.23.6
            return next(new AppError('you have not permission to perform this action', 403))
        }
        next()
    }
}


exports.forgotPassword =  catchAsync(async(req, res, next) =>{
    // 1) gET USER  BASED  on Post email
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return next(new AppError(`there is no user with email: ${req.body.email}`, 404))
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});
    // 3) send it back to email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    const message  = `Forgot your password?  Submit a PATCH request with your new password and passwordConfirm to ${resetURL}`
    console.log(user.email)
try{

    await sendEmail({
        email:  user.email,
        subject: 'Your passoword reset token (valid for 10 minutes)',
        message
    })

    res.status(200).json({
        status: 'success',
        message: 'Token sent to email'
    })
}catch(err){
    console.log(err)
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});
        return next(new AppError('there was an error sending the email, try again later!', 500))
}
   
});

exports.resetPassword= catchAsync ( async (req, res, next) =>{
 // 1) get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    console.log('hashedBack ', hashedToken)
    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}})
 //2) if token  has not expired, and there is user, set the new passwordW
    if(!user){
        return next(new AppError('Token is Invalid or expired'), 400)
    }
    user.password = req.body.password
    user.confirmPassword = req.body.confirmPassword
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined
    await user.save();
 // 3) Update changedPasswordAt property for the user 

 // 4) Log the user in, send JWT
 createSendToken(user, 200, res)

})

exports.updatePassword = catchAsync( async (req, res, next) =>{
   
 // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password')

 // 2) check if POSTed current password is correct      


 if(! (await user.correctPassword(req.body.currentPassword, user.password))) return next(new AppError('current password is wrong', 401))  
    
 // 3) if so, update password
 user.password = req.body.password;
 user.confirmPassword = req.body.confirmPassword
 await user.save()
    // we must not use update in anything related to passwords  pre middleware and validators won't work
 // 4) Log user in, send JWT 
 createSendToken(user, 200, res)
 
})

// my solution
// exports.updatePassword = catchAsync( async (req, res, next) =>{
//     const {email, currentPassword, newPassword, confirmNewPassword} = req.body
//  // 1) Get user from collection
//     const user = await User.findOne({email}).select('+password')
   
//     console.log(user)

//  // 2) check if POSTed current password is correct
//  const correct = await user.correctPassword(currentPassword, user.password)

//  if(!user || !(correct)) return next(new AppError('user with this password not found'))  
    
//  // 3) if so, update password
//  user.password = newPassword;

//  await user.save()

//  // 4) Log user in, send JWT

//  const token =  signToken(user._id)
//  res.status(200).json({
//      status: 'success',
//      token
//  }) 
// })