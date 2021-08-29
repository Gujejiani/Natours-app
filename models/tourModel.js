
const mongoose = require('mongoose')
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'tour most have a name'], //,  we can give error message with array second element 
        unique: true,
        trim: true, 
    },
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
        required: [true, 'Tour should have difficulty']
    },
    ratingAverage: {
            type: Number,
            default: 4.5,
            required: true
    
    },
    ratingQuantity: {
            type: Number,
            default: 4.5,
            required: true
    
    },
    price: Number,
    priceDiscount: Number,
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
        select: false   // with this addition it will not go with all data to and user will not see it 
    },
    startDates: [Date],

})

const Tour = mongoose.model('Tours', tourSchema);

module.exports = Tour