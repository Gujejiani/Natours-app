const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')


const filterObj = (obj, ...allowedFields) =>{
    const newObject = {}
    Object.keys(obj).forEach(key=>{
    if(allowedFields.includes(key)) newObject[key] = obj[key]

    })
    return newObject
}




exports.getMe = (req, res, next )=>{
    req.params.id = req.user.id;
    next()
}

exports.updateME =  catchAsync( async(req, res, next) => {
    // 1) Create error if user POSTs password data
    if(req.body.password || req.body.confirmPassword){
        return next(new AppError('this route is not for password updates. please use /updatePassword', 400))
    }
    // 2) filter out body 
    const filteredBody = filterObj(req.body, 'name', 'email')
     // 3) u[date user document]
    const updatedUSer = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true}); // new true return new updated object
  
    
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUSer
        }
    })
})

exports.deleteME = catchAsync(async (req, res, next)=>{
    await User.findByIdAndUpdate(req.user.id, {active: false})

    res.status(204).json({
        status: 'success',
        data: null
    })
})



exports.createUser = (req, res)=>{
    res.json({
        status: 'for it Please use Sign up '
    })
}
//  Do  not update with this
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
exports.getAllUsers   = factory.getAll(User)
exports.getUser = factory.getOne(User)