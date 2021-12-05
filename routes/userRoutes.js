const express = require('express')

const userController = require('../controllers/userController')
const authController = require('../controllers/autController')

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.patch('/resetPassword/:token', authController.resetPassword)


// Protect all routes after this middleware
router.use(authController.protect)
router.get('/me', userController.getMe, userController.getUser)
router.patch('/updatePassword', authController.updatePassword)
router.patch('/updateME', userController.updateME)
router.delete('/deleteME', userController.deleteME)


router.use(authController.restrictTo('admin'))

router.route('/').get(userController.getAllUsers).post(userController.createUser)
router.route('/:id').get(userController.getUser).delete(userController.deleteUser).patch(userController.updateUser)


module.exports = router