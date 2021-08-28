const fs = require('fs');
const Tour = require('../../models/tourModel.js')

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')) ;


// import data to database

const importData = async ()=>{
try{

  await  Tour.create(tours)
    console.log('data successfully')
}catch(err){
    console.log(err)
}
}


// DELETE ALL DATA FROM COLLECTION 

const deleteData = async ()=>{
    try{
      await  Tour.deleteMany()
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

console.log(process.argv)