const mongoose = require('mongoose')




const bookingSchema = mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tours',
        required: [true, 'booking must belong to tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'USER',
        required: [true, 'booking must belong to user']
    },
    price: {
        type: Number,
        require: [true, 'Booking must have a price.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
})





bookingSchema.pre(/^find/, function(next){
    this.populate('user').populate({
        path: 'tour',
        select: 'name'
    })
    next()
})






const Booking =mongoose.model('Booking', bookingSchema)

module.exports = Booking