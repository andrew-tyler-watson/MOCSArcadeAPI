const express = require('express');

const router = express.Router();

router.get("/", (req, res, next)=>{
    res.sendFile(path.join(__dirname, '../', 'views', 'admin.html'));
})

router.post("/Approve", (req, res, next)=>{

})

router.post("/Deny", (req, res, next)=>{

})

router.post("/Delete", (req, res, next)=>{

})

module.exports = router;