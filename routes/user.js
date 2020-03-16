const express = require('express');

const router = express.Router();

const userController = require('../controllers/user')

/********************\\\\\\\\\
 * Return the page for doing
 * all of the upload related 
 * stuff
 /*******************/////////

router.get("/", userController.games);

/********************\\\\\\\\\
 * Upload a game by writing
 * A record into the db
 /*******************/////////

router.post('/Upload', userController.upload);

/********************\\\\\\\\\
 * Update a gmae by setting
 * its ShouldUpdate bit to 1
 /*******************/////////

router.post('/Update', userController.update)

/********************\\\\\\\\\
 * Delete a game by deleting
 * the record in the database
 /*******************/////////

router.post("/Delete", userController.delete)

module.exports = router;