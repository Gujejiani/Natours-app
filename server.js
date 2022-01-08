const mongoose = require('mongoose');

const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const app = require('./app')

// console.log(app.get('env'))
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=>console.log('connected')).catch(err=>{
    console.log('error accured')
    // console.log(err)
})



// const testTour = new Tour({
//     name: 'kakhaa',
//     rating: 4.3,
//     price: 5
// })

// testTour.save().then(res=>{
//     console.log(res)
// }).catch(err=>{
//     console.log(err)
// })

// console.log(process.env)
const port = process.env.PORT
const server =app.listen(port, ()=>{
    console.log('server started ' + port)
})

process.on('unhandledRejection', err=>{
    console.log('unhandled REJECTION')
    console.log(err.name. err.message)
    server.close(()=>{
        process.exit(1)
    })
})

process.on('SIGTERM', ()=>{
    console.log('SIGTERM RECEIVED. Shutting down gracefully 😣')
    server.close(()=>{
        console.log(' Process terminated!')
    })
})
// test