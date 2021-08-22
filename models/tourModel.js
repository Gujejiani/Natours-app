
const mongoose = require('mongoose')
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'tour most have a name'], //,  we can give error message with array second element 
        unique: true  
    },
    rating: {
        type: {
            type: Number,
            default: 4.5,
            required: true
        },
       
    },
    price: Number
})

const Tour = mongoose.model('Tours', tourSchema);

module.exports = Tour