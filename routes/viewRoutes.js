const express = require('express');
const viewsController = require('../controllers/viewController')
const authController = require('../controllers/autController')
const router = express.Router();


router.use(authController.isLoggedIn)
router.get('/', viewsController.getOverview)


router.get('/tours/:slug', viewsController.getTour )

router.get('/login', viewsController.getLoginForm)
module.exports = router;