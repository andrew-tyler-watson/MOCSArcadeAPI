const express = require('express');
const path = require('path')

const router = express.Router();
const apiController = require('../controllers/api')

router.get('/games', apiController.games);

router.get('/keybinds/:gameName', apiController.keybinds);

router.get('/numPreviews/:gameName', apiController.numPreviews);

router.get('/downloadPreview/:gameName/:previewNumber', apiController.downloadPreview);

module.exports = router;