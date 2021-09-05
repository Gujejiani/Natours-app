const mongoose = require('mongoose')

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
app.listen('3000', ()=>{
    console.log('server started ' + port)
})




// test