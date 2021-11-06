const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')


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