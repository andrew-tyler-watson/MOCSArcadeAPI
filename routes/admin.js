const express = require('express');

const router = express.Router();
const adminController = require('../controllers/admin')

router.get("/", adminController.getAdmin)

router.post("/approve", adminController.postAdminApprove)

// router.post("/Deny", )

// router.post("/Delete", )

module.exports = router;