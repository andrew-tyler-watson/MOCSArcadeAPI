const express = require('express');
const path = require('path')

const router = express.Router();
const apiController = require('../controllers/api')

router.get('/games', apiController.games);

router.get('/keybinds/:gameName', apiController.keybinds);

module.exports = router;