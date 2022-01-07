const catchAsync  = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/apiFeatures')
exports.deleteOne =  Model  => catchAsync(async (req, res, next)=>{
   
    const document =  await Model.findByIdAndDelete(req.params.id)
      if(!document){
         return next(new AppError('no document found with that ID', 404))
      }
      res.status(204).json({
          status: 'success',
          data: {
              data: null
          }
      })
  
 });


// exports.deleteTour = catchAsync(async (req, res, next)=>{
   
//     const tour =  await Tour.findByIdAndDelete(req.params.id)
//       if(!tour){
//          return next(new AppError('no Tour found with that ID', 404))
//       }
//       res.status(204).json({
//           status: 'success',
//           data: {
//               data: null
//           }
//       })
  
//  })



exports.updateOne  = Model => catchAsync(async (req, res, next)=>{
    
   
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true   // to return updated document and not old one 
    })
    if(!doc){
        return next(new AppError('no document found with that ID', 404))
     }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
}) 


// exports.updateTour = catchAsync(async (req, res, next)=>{
    
   
//     const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true   // to return updated document and not old one 
//     })
//     if(!updatedTour){
//         return next(new AppError('no Tour found with that ID', 404))
//      }
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour: updatedTour
//         }
//     })
// }) 


exports.createOne = Model => catchAsync(async (req, res, next)=>{
    // const newTour = new Tour({})
    // newTour.save()  // or we can call create method directly to Tour  see below

    // we need async function to await  creating new tour, alternative would be to use promises but this way is more convenient

    const doc = await Model.create(req.body)

    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    })

});


// exports.addTour = catchAsync(async (req, res, next)=>{
//     // const newTour = new Tour({})
//     // newTour.save()  // or we can call create method directly to Tour  see below

//     // we need async function to await  creating new tour, alternative would be to use promises but this way is more convenient

//     const newTour = await Tour.create(req.body)

//     res.status(201).json({
//         status: 'success',
//         data: {
//             tour: newTour
//         }
//     })

// });




exports.getOne = (Model, popOptions) =>  catchAsync(async(req, res, next)=>{
  
    //.populate('guides') 
  

    let query = Model.findById(req.params.id)
    
    if(popOptions) query.populate(popOptions);
    
    const doc = await query
    // .populate({
    //     path: 'guides',
    //     select: '-__v -passwordChangedAt'
    // })  // fills the guides field with information      see tourModel Guides
    // alternative Tour.findOne({_id: req.params.id})
    if(!doc){
       return next(new AppError('no document found with that ID', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            doc: doc
        }
    })
 
   
})


// exports.getTour =  catchAsync(async(req, res, next)=>{
//     console.log(req.params.id)
//     //.populate('guides') 
//     // const tour = await Tour.findById(req.params.id).populate('guides')  // fills the guides field with information      see tourModel Guides
//     const tour = await Tour.findById(req.params.id).populate('reviews')
//     // .populate({
//     //     path: 'guides',
//     //     select: '-__v -passwordChangedAt'
//     // })  // fills the guides field with information      see tourModel Guides
//     // alternative Tour.findOne({_id: req.params.id})
//     if(!tour){
//        return next(new AppError('no Tour found with that ID', 404))
//     }
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour: tour
//         }
//     })
 
   
// })


exports.getAll = Model => catchAsync(async (req, res, next)=>{

    // to allow for nested GET reviews on tour
    let filter = {}
    if(req.params.tourId) filter = {tour: req.params.tourId}



    const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limiting().pagination()

    // with explain you can view additional data of query search in the response, data like how many  items checked, returned etc
   //const doc = await features.query.explain()    
   const doc = await features.query      // query.sort().select().skip()....

    //send response
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            data: doc
        }
    })

})




// exports.getAllTours   = catchAsync(async (req, res, next)=>{
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

// })