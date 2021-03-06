
const express = require('express');
const morgan = require('morgan')


const AppError = require('./utils/appError') 
const globalErrorHandler =  require('./controllers/errorControler')
const reviewRouter = require('./routes/reviewRoutes')
const path = require('path')
const cookieParser = require('cookie-parser')
/// security
const rateLimit = require('express-rate-limit');

const compression = require('compression');

const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const tourRouter  = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const viewRouter = require('./routes/viewRoutes')
  const bookingRouter = require('./routes/bookingRoutes')
  const bookingController = require('./controllers/bookingController')
const cors = require('cors')

const app = express();

app.enable('trust proxy')

// define view engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views')) // we don't have to think if directory will have slash or not

// serving static files
// app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(__dirname, 'public')))

// api.natours.com, front-end natours.com
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))

//1 ) Global Middleware
// implement cors
app.use(cors())
// Access-Control-Allow-Origin * 

app.options('*', cors()) // for complex request  like patch delete  send cookie etc

//Set Security Http headers

const styleSrcUrls = [
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
];
const scriptSrcUrls = [
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://cdnjs.cloudflare.com/',
  'https://*.stripe.com/',
  'https://js.stripe.com/',
];
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
  'https://bundle.js:*',
  'ws://127.0.0.1:*/',
];


app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      scriptSrc: [
        "'self'",
        'https://*.cloudflare.com',
        'https://*.stripe.com',
        'https://*.mapbox.com'
      ],
      frameSrc: ["'self'", 'https://*.stripe.com'],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      workerSrc: ["'self'", 'data:', 'blob:'],
      childSrc: ["'self'", 'blob:'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", 'blob:', 'https://*.mapbox.com'],
      upgradeInsecureRequests: []
    }
  })
);


// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "https://js.stripe.com/"],
//       objectSrc: ["'none'"],
//       upgradeInsecureRequests: [],
//       // scriptSrcUrls,
//       // styleSrcUrls
//       // styleSrcUrls: [
//       //   "'https://api.mapbox.com/'",
//       //   "'https://api.tiles.mapbox.com/'",
//       //   "'https://fonts.googleapis.com/'",
//       // ],

//     },

//   })
// );




  const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];
  // app.use(
  //   helmet.contentSecurityPolicy({
  //     directives: {
  //       defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
  //       baseUri: ["'self'"],
  //       fontSrc: ["'self'", 'https:', 'http:', 'data:'],
  //       scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
  //       styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
  //     },
  //   })
  // );
// Limit requests from same api
const limiter = rateLimit({
    max: 100,
    windowMs:60 * 60 * 1000,
    message: 'To man request from this IP, please try again in an hour' 
})

app.use('/api',limiter); // will apply all routes which start with /api



app.post('/webhook-checkout', express.raw({type: 'application/json'}),bookingController.webhookCheckout)









//  middleware


// development login
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(compression())


app.use(express.urlencoded({extended: true, limit:  '10kb'}))// parses data with form urlencoded form

// body parser, reading data from body into req.body
app.use(express.json({limit: '10mb'})) // we limit it to ten kilobyte

app.use(cookieParser())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()) // removes dolar sign and etx

// Data sanitization against XSS   


app.use(xss()) // cleans javascript code in extracted  html


// Prevent parameter pollution from query
app.use(hpp({
    whitelist: [
        'duration', 'ratingQuantity', 'average', 'maxGroupSize', 'difficulty', 'price'
    ]
}))






// Test middleware
app.use((req, res, next)=>{
  req.requestTime = new Date().toISOString()
//   console.log(req.headers)
    // console.log(req.cookies)
    next();
})



// app.get('/', (req, res)=>{
//     res.send('page not found')
//     res.end()
// })



// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', addTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour )





// routes


app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)

app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/booking', bookingRouter)
// server started
app.all('*', (req, res, next)=>{


    // const err = new Error(`Can't find ${req.originalUrl}`)
    // err.status = 'fail';
    // err.statusCode =404
    // next(err)   if ever next function will get argument express will already know that there was an error
    next(new AppError(`Can't find ${req.originalUrl}`, 404))
})       

app.use(globalErrorHandler)


module.exports = app