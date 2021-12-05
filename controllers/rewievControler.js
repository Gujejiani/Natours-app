
const Review = require('../models/reviewModel')
// const catchAsync = require('../utils/catchAsync')
// const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')

exports.setTourUserIds = (req, res, next)=> {
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;   // with nested routes we populate user and tour )) clever
    next()
}


exports.createReview = factory.createOne(Review)
exports.getReviews = factory.getAll(Review)
exports.getReview = factory.getOne(Review)
exports.updateReview = factory.updateOne(Review);
exports.deleteReview= factory.deleteOne(Review)