const express = require('express');
const viewsController = require('../controllers/viewController')
const authController = require('../controllers/autController')
const router = express.Router();
const bookingController = require('../controllers/bookingController')

// router.use(authController.isLoggedIn)

router.use(viewsController.alerts)

router.get('/',

// bookingController.createBookingCheckout, 

authController.isLoggedIn, viewsController.getOverview)


router.get('/tours/:slug',authController.protect, authController.isLoggedIn,viewsController.getTour )

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm)
router.get('/sign-up',  viewsController.doSignUp)

router.get('/me',authController.protect, viewsController.getAccount)

router.get('/me-tours',authController.protect, viewsController.getMyTours)

router.post('/submit-user-data', authController.protect, viewsController.getMyTours)

module.exports = router;