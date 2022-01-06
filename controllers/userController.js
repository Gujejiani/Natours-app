const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')
const multer = require('multer') // for img uploads
const sharp = require('sharp');



// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         cb(null, 'public/img/users')
//     },
//     filename: (req, file, cb)=>{
      
//         const ext = file.mimetype.split('/')[1];
//                          //  user-23723823-3232932.jpeg
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//     }
// })
const multerStorage = multer.memoryStorage(); // image will be stored as a buffer


const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image')){     
        cb(null, true)
    }else{
        cb(new AppError('Not an image! Please upload only images.'), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})




exports.uploadUserPhoto = upload.single('photo')


exports.resizeUserPhoto = catchAsync( async(req, res, next)=>{
    if(!req.file) return next();
    req.file.filename= `${req.user.id}-${Date.now()}.jpeg`
   await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/img/users/${req.file.filename}`)

    next()
})



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

    console.log(req.file)
    console.log(req.body)
    // 1) Create error if user POSTs password data
    if(req.body.password || req.body.confirmPassword){
        return next(new AppError('this route is not for password updates. please use /updatePassword', 400))
    }
    // 2) filter out body 
    const filteredBody = filterObj(req.body, 'name', 'email')
    if(req.file) filteredBody.photo = req.file.filename;
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