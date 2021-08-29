const express = require('express')
const tourController = require('../controllers/tourController')
const router = express.Router()

// router.param('id', tourController.checkID)


router.route('/tour-stats').get(tourController.getTourStats)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)

router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours)
// Routes
router.route('/').get(tourController.getAllTours).post(tourController.checkAddedTour,tourController.addTour)
router.route('/:id').patch(tourController.updateTour).delete(tourController.deleteTour).get(tourController.getTour)




module.exports = router;