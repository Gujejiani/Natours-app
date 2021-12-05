const fs = require('fs');
const Tour = require('../../models/tourModel.js')
const Review = require('../../models/reviewModel')
const User = require('../../models/userModel')

const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config({path: './config.env'})


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

//Read json fle

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')) ;
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8')) ;
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')) ;


// import data to database

const importData = async ()=>{
try{

  await  Tour.create(tours)
  await  Review.create(reviews)
  await  User.create(users, {validateBeforeSave: false}) // with this wea re not validating with what we have in modal
    console.log('data successfully imported')
}catch(err){
    console.log(err)
}
}


// DELETE ALL DATA FROM COLLECTION 

const deleteData = async ()=>{
    try{
      await  Tour.deleteMany();
      await  User.deleteMany();
      await Review.deleteMany()
        console.log('data successfully deleted')
    }catch(err){
console.log(err)
    }
}

if(process.argv[2] ===  '--import' ){
    importData()
}
if(process.argv[2] ===  '--delete' ){
    deleteData()
}

// console.log(process.argv)