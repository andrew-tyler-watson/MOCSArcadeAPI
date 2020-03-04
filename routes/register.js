const express = require('express');

const router = express.Router();

router.get("/", (req, res, next)=>{
    res.sendFile(path.join(__dirname, '../', 'views', 'register.html'));
})

router.post("/RegisterUser", (req, res, next)=>{

})


module.exports = router;

