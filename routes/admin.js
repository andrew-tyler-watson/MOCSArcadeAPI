const express = require('express');

const router = express.Router();
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

router.get("/editGames", isAuth.isLoggedIn, isAuth.isAdmin, adminController.getAdminEditGames)

router.get("/editUsers", isAuth.isLoggedIn, isAuth.isAdmin, adminController.getAdminEditUsers)

router.get("/viewReports", isAuth.isLoggedIn, isAuth.isAdmin, adminController.getAdminReportViewer)

router.post("/demote", isAuth.isLoggedIn, isAuth.isAdmin, adminController.postDemote)

router.post("/promote", isAuth.isLoggedIn, isAuth.isAdmin, adminController.postPromote)

router.post("/delete", isAuth.isLoggedIn, isAuth.isAdmin, adminController.postDelete)

router.post("/approve", isAuth.isLoggedIn, isAuth.isAdmin, adminController.postApprove)

router.post("/revoke", isAuth.isLoggedIn, isAuth.isAdmin, adminController.postRevoke)

router.post("/closeReport", isAuth.isLoggedIn, isAuth.isAdmin, adminController.postCloseReport)

module.exports = router;