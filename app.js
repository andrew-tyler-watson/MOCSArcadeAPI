const http = require('http');
const fs = require('fs')
const port = process.env.port || 8080;

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const mongoDBStore = require('connect-mongodb-session')(session)
const MONGODB_URI = 'mongodb+srv://MOCSArcade2:Hamburger69@cluster0-xczcq.gcp.mongodb.net/MOCSArcade?retryWrites=true&w=majority';

const app = express();
const store = new mongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})


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

app.use(session({secret: 'alkjasdlfk;lasdasdfiahusdfkljasdfbalksdhfjalkjsdnfljkasdnf',
                    resave: false, saveUninitialized: false, store: store}))

app.use("/admin", adminRoutes);
app.use("/login", loginRoutes);
app.use("/user", userRoutes);

app.use("/", (req, res, next)=>{
    res.redirect('/login')
})

mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(port)
    })
    .catch(err =>{
        console.log(err)
    })
