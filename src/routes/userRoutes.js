const router = require('express').Router()
const isAuthenticated = require('../middlewares/IsAuthenticatedMiddleware')
const UserController = require('../controllers/usersController')
const User = require('../models/User')


router.get('/:id',[isAuthenticated.check,UserController.getUserById])
router.post('/update/:id',UserController.updateUser)

module.exports = router