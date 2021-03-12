const express = require('express');

const router = express.Router();

const gameController = require('../controllers/game')

/********************\\\\\\\\\
 * Get keybinds for game by name
 /*******************/////////

 router.get('/keybinds/:gameName', gameController.keybinds);

 /********************\\\\\\\\\
  * Get keybinds for game by name
  /*******************/////////
 
  router.get('/download/:gameName/:versionName?', gameController.download);
  
module.exports = router;