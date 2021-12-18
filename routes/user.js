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
 * of a user
 /*******************/////////

router.get("/user/:userid", isAuth.isLoggedIn, userController.userDetails);

/********************\\\\\\\\\
 * Return the page for editing
 * all the personal details 
 * of a specific game
 /*******************/////////

router.get("/editUser/:userid", isAuth.isLoggedIn, userController.editUser);

/********************\\\\\\\\\
 * Save changes to a user
 /*******************/////////

router.post('/uploadUser/:userid', isAuth.isLoggedIn, userController.uploadUser);

router.get("/help", isAuth.isLoggedIn, userController.help)

module.exports = router;