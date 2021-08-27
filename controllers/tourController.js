const fs = require('fs')
const Tour = require('../models/tourModel')
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const Tours  =  require('../models/tourModel')

// so cool before sending data we check if id is valid for all routes delete and add or update by id
// exports.checkID  =  (//req, res, next, val)=>{
//     // if(val  * 1 > tours.length){
//     //     return res.status(404).json({
//     //         status: 'fail',
//     //         message: 'Invalid ID'
//     //     })
//     // }
//     next()
// }


exports.checkAddedTour = (req, res, next)=>{
   console.log('checks')
    if(!req.body?.name || !req.body?.price){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })

    }
    console.log('yes it is valid ', req.body)

    next()
}

exports.getAllTours  = async (req, res)=>{

    try{
        const tours = await Tour.find()


    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })

    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
       console.log(err)
    }
    
}
exports.getTour = async(req, res)=>{
    console.log(req.params.id)
   try{
    const tour = await Tour.findById(req.params.id)
    // alternative Tour.findOne({_id: req.params.id})

console.log('tour ', tour)

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
   }catch(err){
    res.status(400).json({
        status: 'fail',
        
    })
   }
   
}
exports.addTour = async (req, res)=>{
    // const newTour = new Tour({})
    // newTour.save()  // or we can call create method directly to Tour  see below

    // we need async function to await  creating new tour, alternative would be to use promises but this way is more convenient
try{
    const newTour = await Tour.create(req.body).then()

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
}catch (err){
    res.status(400).json({
        status: 'fail',
        message: err
    })
    console.log(err)
}
};
exports.updateTour = async (req, res)=>{
    const updatedTour = req.body
    try{
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true   // to return updated document and not old one 
        })
        res.status(200).json({
            status: 'success',
            data: {
                tour: updatedTour
            }
        })
    }catch(err){

        
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }


   
} 

exports.deleteTour = async (req, res)=>{
    try{
     await Tour.findByIdAndDelete(req.params.id)
     
     res.status(204).json({
         status: 'success',
         data: {
             data: null
         }
     })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

   
}