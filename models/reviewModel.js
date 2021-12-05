const mongoose = require('mongoose')



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







const Review = mongoose.model('Review', reviewSchema)


module.exports = Review