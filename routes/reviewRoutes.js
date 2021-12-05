const express = require('express')
const reviewController = require('../controllers/rewievControler')
const authController =  require('../controllers/autController')
const router = express.Router({
    mergeParams: true     // to access parameters from different route  //  POST /tour/323223/reviews/23 we can access 323223
})

router.use(authController.protect)

router.route('/')
.get( reviewController.getReviews)
.post(
    authController.restrictTo('user'), 
    reviewController.setTourUserIds,
    reviewController.createReview
);


router.route('/:id').get(reviewController.getReview).patch(authController.restrictTo('user', 'admin'), reviewController.updateReview).delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview)
// router.route('/addReview').post(authController.protect, authController.restrictTo('user'), reviewController.createReview)

// router.route('/getReviews').get( reviewController.getReviews)


module.exports = router