const express = require('express');
const path = require('path')

const router = express.Router();
const loginController = require('../controllers/login')
const isAuth = require('../middleware/is-auth')

//Here our gets are returning stuff

router.get('/',  isAuth.isNotLoggedIn, loginController.login);

router.get('/register', isAuth.isNotLoggedIn, loginController.register)

//Here our posts are doing stuff

router.post('/', isAuth.isNotLoggedIn, loginController.postLogin)

router.post('/register',  isAuth.isNotLoggedIn, loginController.postRegister)

// Email authentication

router.get('/authenticate/:authenticationCode', loginController.authenticate)


router.get('/logout',  loginController.logout)

module.exports = router;