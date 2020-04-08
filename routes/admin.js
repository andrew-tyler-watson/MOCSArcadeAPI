const express = require('express');

const router = express.Router();
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

router.get("/editGames", isAuth.isLoggedIn, isAuth.isAdmin, adminController.getAdminEditGames)

router.get("/editUsers", isAuth.isLoggedIn, isAuth.isAdmin, adminController.getAdminEditUsers)

router.post("/authorize", isAuth.isLoggedIn, isAuth.isAdmin, adminController.postAuthorize)

router.post("/deauthorize", isAuth.isLoggedIn, isAuth.isAdmin, adminController.postDeauthorize)

router.post("/demote", isAuth.isLoggedIn, isAuth.isAdmin, adminController.postDemote)

router.post("/promote", isAuth.isLoggedIn, isAuth.isAdmin, adminController.postPromote)

router.post("/delete", isAuth.isLoggedIn, isAuth.isAdmin, adminController.postDelete)


module.exports = router;