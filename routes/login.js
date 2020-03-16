const express = require('express');
const path = require('path')

const router = express.Router();
const loginController = require('../controllers/login')

//Here our gets are returning stuff

router.get('/', loginController.login);

router.get('/register', loginController.register)

//Here our posts are doing stuff

router.post('/', loginController.doLogin)

router.post('/register', loginController.doRegistration)

module.exports = router;