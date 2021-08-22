const express = require('express')
const tourController = require('../controllers/tourController')
const router = express.Router()

// router.param('id', tourController.checkID)





// Routes
router.route('/').get(tourController.getAllTours).post(tourController.checkAddedTour,tourController.addTour)
router.route('/:id').patch(tourController.updateTour).delete(tourController.deleteTour).get(tourController.getTour)




module.exports = router;