const mongoose = require('mongoose')

const Tour = require('./tourModel')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required : [true, 'review can not be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },


     tour: {
         type: mongoose.Schema.ObjectId,
         ref: 'Tours',
         required: [true, 'Review must belong to a tour']
     },
     user: {
         type: mongoose.Schema.ObjectId,
         ref: 'USER',
         required: [true,  'Review must belong to a user']
     }
},

{
    // to use  property which will not be saved in database because we can easily calculate from  properties which we have already
    toJSON: {virtuals: true},
    toObject: {virturls: true} 
}


)
reviewSchema.pre(/^find/,function(next){
    // this.populate('tour')
    // this.populate('user')
    // this.populate({
    //     path:  'tour',
    //     select: 'name',
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // })
this.populate({
        path: 'user',
        select: 'name photo'
    })
    next()

})

// with this change only 1 review can be applicable from a user on a tour
reviewSchema.index({tour: 1,  user: 1}, {unique: true})

// calculates average rating by reviews count and reviews vales
reviewSchema.statics.calcAverageRatings =  async function(tourId){
     // points to modal and we have to call aggregate always in modal // see tour Controller
    // console.log('tourId ',tourId)
     const stats =  await   this.aggregate([    
            {
                $match: {tour: tourId}
            },
            {
                // groups data by added properties
                $group: {
                    _id: '$tour',
                    nRating: {$sum: 1},  //  if five review added number of rating will be 5
                    avgRating: {$avg: '$rating'},
                }
            }
           
        ])

        // add data to Tour  
        if(stats.length > 0){
            await Tour.findByIdAndUpdate(tourId, {
                ratingQuantity: stats[0].nRating,
                ratingAverage: stats[0].avgRating
            })
        }else{
            await Tour.findByIdAndUpdate(tourId, {
                ratingQuantity: 0,
                ratingAverage: 4.5
            })
        }
    
        //console.log(stats)
}
// with pre we don't have new added review in the data
reviewSchema.post('save', function(){
    //points document of current review
    this.constructor.calcAverageRatings(this.tour)
   
   
})

// findByIdAndUpdate
// findByIdAndDelete 
reviewSchema.pre(/^findOneAnd/,async function(next){
  this.r =  await this.findOne() // review

  // calculate average rating after update
  //console.log(' pre findOndAnd')
  
  next()
})
reviewSchema.post(/^findOneAnd/,async function(){
    // this.r =  await this.findOne() // doesn't work from here because query is already executed
 await this.r.constructor.calcAverageRatings(this.r.tour)
})
const Review = mongoose.model('Review', reviewSchema)


module.exports = Review