
const express = require('express');
const morgan = require('morgan')
const tourRouter  = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const AppError = require('./utils/appError') 
const globalErrorHandler =  require('./controllers/errorControler')
const reviewRouter = require('./routes/reviewRoutes')
const path = require('path')
/// security
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const app = express();

// define view engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views')) // we don't have to think if directory will have slash or not

// serving static files
// app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(__dirname, 'public')))



//1 ) Global Middleware


//Set Security Http headers
app.use(helmet())

// Limit requests from same api
const limiter = rateLimit({
    max: 100,
    windowMs:60 * 60 * 1000,
    message: 'To man request from this IP, please try again in an hour' 
})

app.use('/api',limiter); // will apply all routes which start with /api

//  middleware


// development login
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// body parser, reading data from body into req.body
app.use(express.json({limit: '10mb'})) // we limit it to ten kilobyte

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

    next();
})



app.get('/', (req, res)=>{
    res.send('page not found')
    res.end()
})



// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', addTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour )





// routes



app.use('/api/v1/tours', tourRouter)

app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
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