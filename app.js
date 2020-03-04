const http = require('http');
const fs = require('fs')

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express();

/***********************************************\\\\\\\\\
 *  import (essentially) our routing scripts
 *  and tie them to their respective url routes 
/***********************************************/////////
const adminRoutes = require('./routes/admin')
const loginRoutes = require('./routes/login')
const registerRoutes = require('./routes/register')
const uploadRoutes = require('./routes/upload')

app.use(bodyParser.urlencoded({extended: false}));

app.use("/admin", adminRoutes)
app.use("/login", loginRoutes)
app.use("/register", registerRoutes)
app.use("/upload", uploadRoutes)

app.use("/", (req, res, next)=>{
    res.sendFile(path.join(__dirname, '/', 'views', 'home.html'));
})

app.listen(3000);