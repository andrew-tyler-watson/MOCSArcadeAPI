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
 * all the personal details
 * of a specific game
 /*******************/////////

router.get("/details/:gameid", isAuth.isLoggedIn, userController.details);

/********************\\\\\\\\\
 * Return the page for editing
 * all the personal details 
 * of a specific game
 /*******************/////////

router.get("/edit/:gameid", isAuth.isLoggedIn, userController.edit);

/********************\\\\\\\\\
 * Upload a game by writing
 * A record into the db
 /*******************/////////

router.post('/Upload', isAuth.isLoggedIn, userController.upload);

/********************\\\\\\\\\
 * Delete a game by deleting
 * the record in the database
 /*******************/////////

router.post("/Delete", isAuth.isLoggedIn, userController.delete)

router.get("/help", isAuth.isLoggedIn, userController.help)

module.exports = router;