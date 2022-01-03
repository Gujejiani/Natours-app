const express = require('express');
const viewsController = require('../controllers/viewController')
const authController = require('../controllers/autController')
const router = express.Router();


// router.use(authController.isLoggedIn)
router.get('/',  authController.isLoggedIn, viewsController.getOverview)


router.get('/tours/:slug',  authController.isLoggedIn,viewsController.getTour )

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm)

router.get('/me',authController.protect, viewsController.getAccount)

router.post('/submit-user-data', authController.protect, viewsController.updateUserData)

module.exports = router;