
const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
const User = require('./userModel')
const tourSchema = new mongoose.Schema(   {
    name: {
        type: String,
        required: [true, 'tour most have a name'], //,  we can give error message with array second element 
        unique: true,
        trim: true,
        maxlength: [40, 'tour name must have less or equal characters'],
        minlength: [1, 'name characters should be more than 1'],
        // validate: [validator.isAlpha, "tour name should only contain characters"]
    },
    slug: String,
    duration: {
        type: Number,
        default: 5,
        required: [true, 'Tour must have a duration']
    },
    maxGroupSize:  {
        type: Number,
        required: [true, 'Tour must have group size']
    },
    difficulty: {
        type: String,
        required: [true, 'Tour should have difficulty'],
        // enum: { // works only on strings
        //     values: ['easy', 'medium', 'hard'],
        //     message:  'Difficulty is either: easy, medium, difficult'
        // }
    },
    ratingAverage: {
            type: Number,
            default: 4.5,
            required: true,
            min: [1, 'rating muse  be above 1.0'],
            max: [10, 'ratingAverage should be less than 1']
    
    },
    ratingQuantity: {
            type: Number,
            default: 4.5,
            required: true
    
    },
    price: Number,
    priceDiscount: {
        type: Number,
        validate:{
            validator: function(val){
                // this only points  to current doc on new document creation
                return val < this.price
            },
            message: 'Discount price  ({VALUE}) should be below regular price'
        } 
    },
    summary: {
        type: String,
        trim: true,  // removes all the white spaces  
        required: [true, "tour must have description"],
        
    },
    description:{
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, "Tour must have cover image"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,   // with this addition it will not go with all data to and user will not see it 
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
       //GeoJSON 
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'point',
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {type: mongoose.Schema.ObjectId,
        ref: 'USER'
        }
    ]
}, 


{
    // to use virtual property which will not be saved in database because we can easily calculate from  properties which we have already
    toJSON: {virtuals: true},
    toObject: {virturls: true} 
}
)

tourSchema.virtual('durationWeeks').get(function(){
    return +this.duration / 7
})
//Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField:  'tour',
    localField: '_id'
})

// mongoose middleware
// this function will run when we save tours data into database                       p.s we need normal function because of this keyword
tourSchema.pre('save', function(next){ //Document middleware  it runs before .save() and .create()  only
 console.log(this)
 this.slug = slugify(this.name, {lower: true})
 next();
})


// Embedding document

// tourSchema.pre('save', async function(next){
//   const guidesPromises  =   this.guides.map(async id =>  User.findById(id))
//  this.guides = await Promise.all(guidesPromises)
// })




/// query middleware              this keyword will  now target current query and not current document
// tourSchema.pre('find', function(next){
tourSchema.pre(/^find/, function(next){ // /^find/  with regular expression it will run every method which has find  like find, findOne  
    // console.log(this)
    // this.find({secretTour: {$ne: false} })
    this.start = Date.now()
    next()
})

// tourSchema.pre('findOne', function(next){
//     console.log(this)
//     this.find({secretTour: {$ne: false} })
//     next()
// })
tourSchema.post(/^find/, function(docs, next){  // executing after  query search is done
    console.log(`query took ${Date.now()- this.start}`)
// console.log(docs);
next()
});

tourSchema.pre(/^find/, function(next){
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    })
    console.log('--------------------------------------------------------------------------- kk ')
   
    next()
})



// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({$match: {secretTour: {$ne: true}}})
    // console.log(this.pipeline());
    next()
}) 
const Tour = mongoose.model('Tours', tourSchema);

module.exports = Tour
