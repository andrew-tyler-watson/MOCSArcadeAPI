const express = require('express');
const path = require('path')

const router = express.Router();

router.get("/", (req, res, next)=>{
    res.sendFile(path.join(__dirname, '../', 'views', 'login.html'));
})

router.get("/DoLogin", (req, res, next)=>{
    console.log("Login did")
})

router.get("/ForgotPassword", (req, res, next)=>{

})

module.exports = router;