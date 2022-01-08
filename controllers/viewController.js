const Tour = require('../models/tourModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')
const Booking = require('../models/bookingModel')

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


exports.getMyTours=  catchAsync(async (req, res, next)=>{
//1) find all bookings

    const bookings = await   Booking.find({user: req.user.id})

 // 2)  find tours with returned IDS

 const toursIDs = bookings.map(el=> el.tour)

 const tours = await Tour.find({_id: {$in: toursIDs}}) // selects matches of all the array elements

res.status(200).render('overview', {
    title: 'My tours',
    tours
})

})


exports.alerts = (req, res, next)=>{
    const {alert} = req.query
    if(alert === 'booking'){
        res.locals.alert = 'Your Booking was successful! if your booking doesn\'t show up immediately please come back later';
    }
   
    next()
}