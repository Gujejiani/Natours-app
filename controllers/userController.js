const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')
const AppError = require('./../utils/appError')

const filterObj = (obj, ...allowedFields) =>{
    const newObject = {}
    Object.keys(obj).forEach(key=>{
    if(allowedFields.includes(key)) newObject[key] = obj[key]

    })
    return newObject
}


exports.getAllUsers   = catchAsync(async (req, res, next)=>{
  

    //executed query
   const users = await User.find();      // query.sort().select().skip()....

    //send response
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users: users
        }
    })

})



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


exports.getUser = (req, res)=>{
    res.json({
        status: 'not yet complited man'
    })
}
exports.createUser = (req, res)=>{
    res.json({
        status: 'not yet complited man'
    })
}

exports.updateUser = (req, res)=>{
    res.json({
        status: 'not yet complited man'
    })
}
exports.deleteUser = (req, res)=>{
    res.json({
        status: 'not yet complited man'
    })
}