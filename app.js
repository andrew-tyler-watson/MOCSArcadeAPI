/** 
 * This sets our port constant to a 
 * port specified in the environment of
 * our node process. This is needed for
 * deployment on Heroku 
 ***/
const port = process.env.PORT || 8080;


/**
 * Express is like a framework
 * It abstract away a lot of stuff
 * in the NodeJS runtime and makes
 * it easier to spin up servers
 * and configure middlewares
 */
const express = require('express')

const bodyParser = require('body-parser')

/**
 * This is the package we use to talk to
 * our mongo database. It is our Object
 * Document Mapper. This is, it maps
 * our Documents in the database
 * (analagous to rows in relational databases)
 * to objects in our app. See the models folder
 * for how this is being used to create Schema
 * for our objects
 */
const mongoose = require('mongoose')

/**
 * This package is used to store sessions, so 
 * when a user logs in, they stay logged in
 * via a session. In this app we store sessions
 * in the database. They are deleted after a 
 * period of time or when the user hits the logout
 * button
 * 
 */
const session = require('express-session')
/**
 * This is the package used to protect us
 * Cross site request forgery attacks
 * 
 */
const csrf = require('csurf')
/**
 * we now initialize our middleware from this package.
 * It will be added to the app after session and body-parser is.
 * Very important as this middle ware uses that session
 */
const csrfProtection = csrf();
/**
 * This is the package that handles storing session data 
 * in the database. It uses the session collection (one is created if none exists)
 * With this package, only the session ID is stored in cookies in the browser
 */
const mongoDBStore = require('connect-mongodb-session')(session)

/**
 * This is our connection string to our mongo cluster.
 * Needed for heroku deployment
 */
let MONGODB_URI = ''
 if(process.env.DATABASE_URL){
    MONGODB_URI = process.env.DATABASE_URL
 }
 else{
    MONGODB_URI = 'mongodb+srv://MOCSArcade2:Hamburger69@cluster0-xczcq.gcp.mongodb.net/MOCSArcade?retryWrites=true&w=majority';

 }

/**
 * This is literally our application. It is a node server,
 * created through the express package. This is what we 
 * tack our middlewares onto.
 * 
 */
const app = express();
//Make it so our app can find our own files
app.use(express.static(__dirname + '/public'));

/**
 * This is the instance of our database session store
 */
const store = new mongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})

/**
 * 
 */
const flash = require('connect-flash')
/**
 * Here we set our view engine. Now our app knows which
 * engine we are using to create our web pages.
 * In case, you were wondering, this is pretty much the
 * definition of dynamic web pages. When a request is sent, 
 * logic is run to piece together html instead of just 
 * sending static pages
 */
app.set('view engine', 'ejs');

/**
 * We are explicitly setting the folder where our views are
 */
app.set('views', 'views');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/**
 * Now that we have a session and a store, we configure this
 * as a middle ware. Every request goes through this middle ware
 * so we have access to the session information. It is very important
 * That this middle ware be added before the routes. Below that we see
 * the csrfProtection middleware being added. For more info, see above
 * import statement. 
 */
app.use(session({secret: process.env.SESSION_SECRET,
                    resave: false, saveUninitialized: false, store: store}))

/**
 * Next we register a middle ware to add a CSRF token to every request.
 * Now we can put a hidden input on all of our forms that will guarantee
 * all requests are coming from pages we render ourselves and not from
 * some malicious site. It is very important that this middleware
 * comes AFTER the body-parser. 
 */

app.use(csrfProtection)
app.use((req, res, next) =>{
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use(flash())

/***********************************************\\\\\\\\\
 *  import (essentially) our routing scripts
 *  and tie them to their respective url routes 
/***********************************************/////////
const adminRoutes = require('./routes/admin')
const loginRoutes = require('./routes/login')
const userRoutes = require('./routes/user')
const gameRoutes = require('./routes/game')
const apiRoutes = require('./routes/api')

/**
 * Now that we have added all of our middle ware (largely packages)
 * our requests are ready for our routes to consume. Our requests must
 * contain information on the session for our routes to be able to do their
 * job effectively.
 */
app.use("/admin", adminRoutes);
app.use("/login", loginRoutes);
app.use("/user", userRoutes);
app.use("/game", gameRoutes);
app.use("/api", apiRoutes)

/**
 * This is a global redirect pretty much.
 * If you just type in our site name,
 * you get redirected to the login page.
 * The login route has custom middle wares
 * that redirect to the user page if
 * a session exists for a logged in user
 * when trying to access it.
 */

app.use("/", (req, res, next)=>{
    res.redirect('/login')
})

/**
 * finally we use mongoose to connect to our database
 * if we connect successfully, we also have our app
 * listen on the Specified port
 */
mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(port)
    })
    .catch(err =>{
        console.log(err)
    })
