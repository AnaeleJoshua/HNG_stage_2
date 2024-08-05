const router = require('express').Router()
const isAuthenticated = require('../middlewares/IsAuthenticatedMiddleware')
const UserController = require('../controllers/usersController')


router.get('/:id',[isAuthenticated.check,UserController.getUserById])

module.exports = router