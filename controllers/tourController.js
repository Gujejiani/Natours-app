const fs = require('fs')

const catchAsync = require('../utils/catchAsync')
const Tour = require('../models/tourModel')
const AppError = require('../utils/appError')
const factory = require('./handlerFactory')

const multer = require('multer');
const sharp = require('sharp')
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
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const Tours  =  require('../models/tourModel')
const multerStorage = multer.memoryStorage(); // image will be stored as a buffer


const multerFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image')){     
        cb(null, true)
    }else{
        cb(new AppError('Not an image! Please upload only images.'), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

// WHEN THERE IS MIX
exports.uploadTourImages = upload.fields([ // req.files
    {name: 'imageCover', maxCount:1},
    {name: 'images', maxCount: 3}
])
// ===========================>when it's one 
//upload.single('image') // req.file
// ===========================>when multiple 
// upload.array('images', 5) // req.files

exports.resizeTourImages =catchAsync( async (req, res, next)=>{
  
    if(!req.files.imageCover || !req.files.images) return next();
    //) cover image
    req.body.imageCover= `tour-${req.params.id}-${Date.now()}-cover.jpeg`
    await sharp(req.files.imageCover[0].buffer).resize(2000, 1333).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/img/tours/${req.body.imageCover }`)
  
    // other images
    req.body.images=[];
  await Promise.all(req.files.images.map(async(file, i)=>{
        const fileName = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`
        await sharp(file.buffer).resize(2000, 1333).toFormat('jpeg').jpeg({quality: 90}).toFile(`public/img/tours/${fileName}`)
        req.body.images.push(fileName)
    }))
   
    next()
})


exports.aliasTopTours =(req, res, next) =>{
    req.query.limit = '5'
    req.query.sort = 'ratingsAverage,price';
    req.query.fields ='name,price,ratingsAverage,difficulty'
    next()
}





exports.checkAddedTour = (req, res, next)=>{

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





exports.getToursWithIn = catchAsync(async (req, res, next)=> {
    //router.route('tours-within/:distance/center/:latlng/:unit', tourController.getToursWithIn) // query params
    const {distance, latlng, unit} = req.params
   const [lat, lng] = latlng.split(',')
    const radius = unit ===  'mi' ? distance / 3963.2: distance  / 6378.1
  
   if(!lat || !lng){
       next(new AppError('Please provide latitude and longitude in the format lat,lng'))
   }

//    console.log(distance, lat, lng, unit)
   const tours = await Tour.find({
       startLocation:  {$geoWithin: {$centerSphere: [[lng, lat], radius]}}   // finds documents by geometry
   })
   res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
        data: tours
    } 
})
})

exports.getDistances = catchAsync(async (req, res, next)=>{

    const {latlng, unit} = req.params
    const [lat, lng] = latlng.split(',')
   
 
    if(!lat || !lng){
        next(new AppError('Please provide latitude and longitude in the format lat,lng'))
    }
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    const distances = await Tour.aggregate([
      {
          $geoNear: { // always needs to be first staged 
            near: {
                type: 'Point',
                coordinates: [lng*1, lat * 1]
            },
            distanceField: 'distance',
            distanceMultiplier: multiplier
          } 
      },
      {
          $project: {
              distance: 1,
              name: 1
          }
      }
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
        data: distances
    } 
})
})

