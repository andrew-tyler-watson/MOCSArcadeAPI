const http = require('http');
const fs = require('fs')

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

/***********************************************\\\\\\\\\
 *  import (essentially) our routing scripts
 *  and tie them to their respective url routes 
/***********************************************/////////
const adminRoutes = require('./routes/admin')
const loginRoutes = require('./routes/login')
const userRoutes = require('./routes/user')

app.use(bodyParser.urlencoded({extended: false}));

app.use("/admin", adminRoutes);
app.use("/login", loginRoutes);
app.use("/user", userRoutes);

app.use("/", (req, res, next)=>{
    res.redirect('/login')
})

mongoose.connect('mongodb+srv://MOCSArcade2:Hamburger69@cluster0-xczcq.gcp.mongodb.net/MOCSArcade?retryWrites=true&w=majority')
    .then(result => {
        app.listen(3000)
    })
    .catch(err =>{
        console.log(err)
    })
