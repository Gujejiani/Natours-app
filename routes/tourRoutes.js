const express = require('express')
const tourController = require('../controllers/tourController')
const authController = require('../controllers/autController')



const router = express.Router()
//const reviewController = require('../controllers/rewievControler')
// router.param('id', tourController.checkID)
const reviewRouter = require('./reviewRoutes')



router.use('/:tourId/reviews', reviewRouter)













router.route('/tour-stats').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'),tourController.getMonthlyPlan)

router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours)


// tours-distance?distance=233&center // query strings
router.route('/tours-within/:distance/center/:latlng/:unit').post(tourController.getToursWithIn) // query params


router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)


// Routes
router.route('/').get( tourController.getAllTours).post(authController.protect,  authController.restrictTo('admin', 'lead-guide'),tourController.checkAddedTour,tourController.addTour)
router.route('/:id').patch(authController.protect, authController.restrictTo('admin', 'lead-guide'),tourController.uploadTourImages, tourController.resizeTourImages, tourController.updateTour).delete(authController.protect, 
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour).get(tourController.getTour)




module.exports = router;