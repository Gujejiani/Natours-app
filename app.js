
const express = require('express');
const morgan = require('morgan')
const tourRouter  = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const app = express();








//  middleware
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}


app.use(express.json())

app.use(express.static(`${__dirname}/public`))



app.use((req, res, next)=>{
     console.log('hello from middleware')
     next()
})

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

module.exports = app