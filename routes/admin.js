const express = require('express');

const router = express.Router();
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

router.get("/", isAuth.isLoggedIn, isAuth.isAdmin, adminController.getAdmin)

router.post("/approve", isAuth.isLoggedIn, isAuth.isAdmin, adminController.postAdminApprove)

// router.post("/Deny", )

// router.post("/Delete", )

module.exports = router;