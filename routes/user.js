const express = require('express');

const router = express.Router();

const userController = require('../controllers/user')
const isAuth = require('../middleware/is-auth')

/********************\\\\\\\\\
 * Return the page for seeing
 * all the other creators' 
 * stuff
 /*******************/////////

router.get("/", isAuth.isLoggedIn, userController.allGames);

/********************\\\\\\\\\
 * Return the page for doing
 * all of the upload related 
 * stuff
 /*******************/////////
router.get("/Games", isAuth.isLoggedIn, userController.games);

/********************\\\\\\\\\
 * Return the page for seeing
 * all the other creators' 
 * stuff
 /*******************/////////

router.get("/details/:gameid", isAuth.isLoggedIn, userController.details);

/********************\\\\\\\\\
 * Upload a game by writing
 * A record into the db
 /*******************/////////

router.post('/Upload', isAuth.isLoggedIn, userController.upload);

/********************\\\\\\\\\
 * Update a gmae by setting
 * its ShouldUpdate bit to 1
 /*******************/////////

router.post('/Update', isAuth.isLoggedIn, userController.update)

/********************\\\\\\\\\
 * Delete a game by deleting
 * the record in the database
 /*******************/////////

router.post("/Delete", isAuth.isLoggedIn, userController.delete)

router.get("/help", isAuth.isLoggedIn, userController.help)

module.exports = router;