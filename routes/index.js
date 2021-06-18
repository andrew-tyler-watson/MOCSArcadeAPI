const express = require('express');

const router = express.Router();

const indexController = require('../controllers/index')

/********************\\\\\\\\\
 * Return the home page for
 * new users to understand what
 * Arc is
 /*******************/////////

router.get("/", indexController.home);


module.exports = router;