const express = require('express')

const toursController = require('../controllers/userController')

const router = express.Router()




router.route('/').get(toursController.getAllUsers).post(toursController.createUser)
router.route('/:id').get(toursController.getUser).delete(toursController.deleteUser).patch(toursController.updateUser)


module.exports = router