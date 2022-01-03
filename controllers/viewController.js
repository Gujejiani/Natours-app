const Tour = require('../models/tourModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')
exports.getOverview =  catchAsync(async (req, res)=>{
    // 1) get tour data from collection
    const tours  = await Tour.find()
    // 2) build template

    // 3) render that template using tour data from 1

    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
});


exports.getTour = catchAsync( async(req, res, next)=>{
    //) get the data, for the tour (including reviews and guides)
        const tour = await Tour.findOne({slug: req.params.slug}).populate({
            path:  'reviews',
            fields: 'review rating user'
        });
    //) bad template

    if(!tour){
        return next(new AppError('there is no tour with that name'))
    }
    console.log('---------------------------------------LOG')
    console.log(req.params)
    //3) render template using data from 1)
    res.status(200).set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
      ).render('tour', {
        title: `${tour.name} Tour`,
        tour: tour
    })
})

exports.getLoginForm  = catchAsync(async (req, res)=>{
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' https://cdnjs.cloudflare.com"
    ).render('login', {
          title: 'Log into your acc'
      })
})

exports.getAccount = catchAsync(async (req, res)=>{
    res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' https://cdnjs.cloudflare.com"
    ).render('account', {
          title: 'Account page'
      })
})

exports.updateUserData  = catchAsync(async (req, res)=>{
     const updatedUser =await  User.findByIdAndUpdate(req.user.id,{
         name: req.body.name,
         email: req.body.email
     },
     {
         new: true, // we want updated result as result
         runValidators: true // to run checks
     })
     res.status(200).set(
        'Content-Security-Policy',
        "connect-src 'self' https://cdnjs.cloudflare.com"
    ).render('account', {
          title: 'Account page',
          user: updatedUser
      })
})