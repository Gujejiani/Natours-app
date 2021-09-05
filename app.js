
const express = require('express');
const morgan = require('morgan')
const tourRouter  = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const AppError = require('./utils/appError') 
const globalErrorHandler =  require('./controllers/errorControler')
const app = express();








//  middleware
// console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}


app.use(express.json())

app.use(express.static(`${__dirname}/public`))





app.use((req, res, next)=>{
  req.requestTime = new Date().toISOString()
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