const express = require('express');

const router = express.Router();

/********************\\\\\\\\\
 * Return the page for doing
 * all of the upload related 
 * stuff
 /*******************/////////

router.get('/', (req, res, next)=>{

})

/********************\\\\\\\\\
 * Upload a game by writing
 * A record into the db
 /*******************/////////

router.post('/Upload', (req, res, next)=>{

});

/********************\\\\\\\\\
 * Update a gmae by setting
 * its ShouldUpdate bit to 1
 /*******************/////////

router.post('/Update', (req, res, next)=>{

})

/********************\\\\\\\\\
 * Delete a game by deleting
 * the record in the database
 /*******************/////////

router.post("/Delete", (req, res, next)=>{
    
})

module.exports = router;