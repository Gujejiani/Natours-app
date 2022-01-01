const express = require('express');
const viewsController = require('../controllers/viewController')

const router = express.Router();

router.get('/', viewsController.getOverview)


router.get('/tours/:slug', viewsController.getTour )


module.exports = router;