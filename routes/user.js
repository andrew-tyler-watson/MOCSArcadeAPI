const express = require('express');

const router = express.Router();

const userController = require('../controllers/user')
const isAuth = require('../middleware/is-auth')

const multer = require('multer');

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

/********************\\\\\\\\\
 * Upload a game by writing
 * A record into the db
 /*******************/////////

var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } ,
    limits: { fileSize: 1500000 }
}); 
  
var upload = multer({ storage: storage }); 

router.post('/Upload', isAuth.isLoggedIn, upload.single('image'), userController.upload);

/********************\\\\\\\\\
 * Delete a game by deleting
 * the record in the database
 /*******************/////////

router.post("/Delete", isAuth.isLoggedIn, userController.delete)

router.get("/help", isAuth.isLoggedIn, userController.help)

module.exports = router;