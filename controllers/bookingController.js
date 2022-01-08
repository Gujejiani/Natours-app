
const catchAsync = require('../utils/catchAsync')
const Tour = require('../models/tourModel')
const User = require('../models/userModel')
const AppError = require('../utils/appError')
const factory = require('./handlerFactory')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const Booking = require('../models/bookingModel')
exports.getCHeckoutSession = catchAsync(async (req, res, next)=>{
 // 1) get the currently booked tour
    const tour = await Tour.findById(req.params.tourId)

 // 2) create checkout  session
  const session = await  stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        // success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        success_url: `${req.protocol}://${req.get('host')}/me-tours`,
        cancel_url:  `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id:  req.params.tourId,
        line_items: [
            {
               name: `${tour.name} Tour`,
               description: tour.summary,
               images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
               amount: tour.price* 100,
               currency: 'usd',
               quantity: 1
            }
        ]
    })

 // 3)  Create session as   response
 res.status(200).json({
     status: 'success',
     session
 })
})



// exports.createBookingCheckout = catchAsync ( async(req, res, next)=>{
//     // This is only temporary
//     // console.log('createBooking')
//     const {tour, user, price} = req.query
  
//     // console.log(tour, user, price)
//     if(!tour && !user && !price) return next();

//     await Booking.create({
//         tour,
//         user,
//         price
//     })
//    res.redirect(req.originalUrl.split('?')[0])
// })

const createBookingCheckout = async  session => {
    const tour = session.client_reference_id
    const user = (await User.findOne({email: session.customer_email})).id
    const { price } = await Tour.findOne({ _id: session.client_reference_id });

    console.log('thouse gyuyssssssssssssssssssssssssssssssssss')
    console.log(tour, user, price)
    try{

  
    await Booking.create({
        tour,
        user,
        price
    })
}catch(err){
    console.log(err)
}
}
exports.webhookCheckout = (req, res, next)=>{
const signature = req.headers['stripe-signature'];
let event;
try{

   event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET)
}catch(err){
    console.log(err)
    return res.status(400).send(`webhook error`)
    }

    if(event.type ==='checkout.session.completed'){
        createBookingCheckout(event.data.object)

        res.status(200).json({received: true})
    }
}

exports.updateBooking =  factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.getAllBooking = factory.getAll(Booking);