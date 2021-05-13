const express = require('express');

const router = express.Router();

const gameController = require('../controllers/game')
const isAuth = require('../middleware/is-auth')

const multer = require('multer');

/********************\\\\\\\\\
 * Return the page for seeing
 * all the personal details
 * of a specific game
 /*******************/////////

router.get("/details/:gameid", isAuth.isLoggedIn, gameController.details);

/********************\\\\\\\\\
 * Return the page for editing
 * all the personal details 
 * of a specific game
 /*******************/////////

router.get("/edit/:gameid", isAuth.isLoggedIn, gameController.edit);

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
    limits: { fileSize: 50000 }
}); 
  
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Wrong file type'));
        }
        cb(null, true)
    }
}); 

router.post('/Upload', isAuth.isLoggedIn, upload.array('image'), gameController.upload);

/********************\\\\\\\\\
 * Download game by name and version
 /*******************/////////

router.get('/download/:gameName/:versionName?', gameController.download);

/********************\\\\\\\\\
 * Report game
 /*******************/////////

router.post('/report', gameController.report);

/********************\\\\\\\\\
 * Rate game
 /*******************/////////

router.post('/rate', gameController.rate);

/********************\\\\\\\\\
 * Comment on game
 /*******************/////////

router.post('/comment', gameController.comment);

/********************\\\\\\\\\
 * Delete comment on game
 /*******************/////////

router.post('/deleteComment', isAuth.isLoggedIn, gameController.deleteComment);

/********************\\\\\\\\\
 * Delete a game by deleting
 * the record in the database
 /*******************/////////

router.post("/Delete", isAuth.isLoggedIn, gameController.delete)
  
module.exports = router;