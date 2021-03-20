const express = require('express');

const router = express.Router();

const gameController = require('../controllers/game')

/********************\\\\\\\\\
 * Get keybinds for game by name
 /*******************/////////

 router.get('/keybinds/:gameName', gameController.keybinds);

 /********************\\\\\\\\\
  * Download game by name and version
  /*******************/////////
 
  router.get('/download/:gameName/:versionName?', gameController.download);

  /********************\\\\\\\\\
   * Report game
   /*******************/////////
  
   router.post('/report', gameController.report);
  
module.exports = router;