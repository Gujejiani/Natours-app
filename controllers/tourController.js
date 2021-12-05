const fs = require('fs')
const catchAsync = require('../utils/catchAsync')
const APIFeatures = require('../utils/apiFeatures')
const Tour = require('../models/tourModel')
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const Tours  =  require('../models/tourModel')
const AppError = require('../utils/appError')
const factory = require('./handlerFactory')
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

exports.aliasTopTours =(req, res, next) =>{
    req.query.limit = '5'
    req.query.sort = 'ratingsAverage,price';
    req.query.fields ='name,price,ratingsAverage,difficulty'
    next()
}





exports.checkAddedTour = (req, res, next)=>{
   console.log('checks')
    if(!req.body?.name || !req.body?.price){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })

    }

    next()
}




exports.getAllTours   = factory.getAll(Tour)
exports.getTour =  factory.getOne(Tour, {path: 'reviews'})

exports.addTour = factory.createOne(Tour)

exports.updateTour = factory.updateOne(Tour)



exports.deleteTour =  factory.deleteOne(Tour)





exports.getTourStats = catchAsync(async (req, res, next)=>{
   
        const stats = await Tour.aggregate([
          {
            $match: { ratingAverage: { $gte: 4.3} },  // filter data                     
          }, 
          {
            $group: {
              _id: '$difficulty',
            //   _id: '$ratingAverage',
              numTours:  {$sum: 1},
              numRatings: { $sum:  '$ratingQuantity'},
              avgRating:  { $avg: '$ratingAverage'},
              avgPrice: { $avg: '$price'},
              minPrice: { $min: '$price'},
              maxPrice: { $max: '$price'},
            },
          },
          {
            $sort: { avgPrice:  -1 }
        },
        {
            $match: {_id: {$ne: 'easy'}}
        }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                stats: stats
            }
        })
})




exports.getMonthlyPlan = catchAsync(async (req, res, next)=>{
   
        const year = +req.params.year  // 2021

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'     //constructs array field from documents and outputs one document from each fields
            },
            {
                $match: { 
                    startDates: {

                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                
                
                }
            }
          },
          {
            $group: {
                _id:  { $month: '$startDates'},
                numTourStarts: { $sum: 1  },
                tours: { $push: '$name' }
            }
          },
          {
            $addFields: {month: '$_id'}
          },
          {
              $project: {
                  _id: 0     // if we put 1 it shows if we put 0 it removed
              }
          },
          {
              $sort: {
                  numTourStarts: -1
              }
          },
        //   {
        //       $limit: 6
        //   }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats: plan
            }
        })

   
})




























































// exports.getAllTours  = async (req, res)=>{

//     try{

        // 1) filtering
    //     const queryObj = {...req.query}
    //     const excludedFields = ['page', 'sort', 'limit', 'fields'];
    //     excludedFields.forEach(el=> delete queryObj[el]);

    //     // advanced filtering
    //    let queryStr = JSON.stringify(queryObj);
    //    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=> `$${match}` )


    //     console.log(JSON.parse(queryStr))
    //     console.log(req.query, queryObj)

        // const tours = await Tour.find({  /#111
        //     duration: 5,
        //     difficulty: 'easy',
        // })
      
        // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')


    // create query


// 2) sorting

// if(req.query.sort){
//     const sortBy = req.query.sort.split(',').join(' ');
//         query = query.sort(sortBy)     // it's not javascript sort       'http://localhost:3000/api/v1/tours?sort=price' if descending order needed =-price
//         // sort('price' ratingsAverage) 
// }else{
//     query = query.sort('-createdAt -duration')
// }


    //{difficult: 'easy', duration: {$gte: 5}} // writing filter object greaterOrEqual  with native MongoDb

    //{difficult: 'easy', duration: {gte: 5}} // writing filter object greaterOrEqual  with native MongoDb  'http://localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy&sort=2' response difference only $gte with dolad sign



// //. 3) field limiting   http://localhost:3000/api/v1/tours?fields=name,duration,difficulty,price     in every case we don't need to send whole data to the client
//     if(req.query.fields){
//         const fields =  req.query.fields.split(',').join(' ');;
//         // query = query.select('name duration price') and it only selects this tree fields and returns them                        man so damn cool 
//         query = query.select(fields)
//     }else{{
//         query = query.select('-__v') // mongoose send __v which is generated automatically  and we add - sign -__v than  it mongoose selects everything beside __v
//     }}



    // 4) pagination  http://localhost:3000/api/v1/tours?page=2&limit=10  //skip skips results despite value of how many to skip
    // const page=  req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;

    //  const skip = (page-1)*limit   

    // // page=2&limit=10, 1-10, page 1, 11-20, page 2 
    // query = query.skip(skip).limit(limit)
    // if(req.query.page){
       
    //     const numTours = await Tour.countDocuments(); // return number of data   
    //     if(skip >= numTours) throw  new Error('this page doesnt exists')
    // }


//     const features = new APIFeatures(Tour.find(), req.query).filter().sort().limiting().pagination()

//     //executed query
//    const tours = await features.query      // query.sort().select().skip()....

//     //send response
//     res.status(200).json({
//         status: 'success',
//         results: tours.length,
//         data: {
//             tours: tours
//         }
//     })

//     }catch(err){
//         res.status(400).json({
//             status: 'fail',
//             message: err
//         })
//        console.log(err)
    