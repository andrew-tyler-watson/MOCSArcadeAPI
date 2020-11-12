const User = require('../models/user');
const bcrypt = require('bcryptjs')
const uuid = require('uuid');

/**
 * Email system for sending email authentication emails
 */
const nodemailer = require('nodemailer');

let transporter = null
if(process.env.NODEMAILER_EMAIL){
    transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: process.env.NODEMAILER_EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
        expires: Number.parseInt(process.env.TOKEN_EXPIRE, 10),
    },
    });
}

exports.login = (req, res, next) =>{
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0]
    }
    else{
        message = null;
    }

        res.render('login/login', {
            pageTitle: 'Welcome!!!',
            errorMessage: message
        })
}

exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const pass = req.body.password;
    User.findOne({username: username})
    .then(user => {
        if(!user){
            req.flash('error', 'Invalid email or password')
            return res.redirect('/login');
        }
        
        bcrypt.compare(pass, user.password)
        .then(doMatch =>{
            if(doMatch){
                req.session.isLoggedIn = true
                req.session.username = username
                req.session.isAdmin = user.isAdmin
                return req.session.save(err =>{
                    console.log(err);
                    res.redirect('/')
                })
            }
            req.flash('error', 'Invalid email or password')
            res.redirect('/login')
        })
        .catch(err =>{
            console.log(err)
            res.redirect('/login');
        })
    })

   
        //save user details in cookie

}

exports.register = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0]
    }
    else{
        message = null;
    }

    res.render('login/register', {pageTitle: 'Register', message: message})
}

exports.postRegister = (req, res, next) => {

    if(req.body.firstName == "" || req.body.firstName == null ||
    req.body.lastName == "" || req.body.lastName == null ||
    req.body.password == "" || req.body.password == null ||
    req.body.username == "" || req.body.username == null ||
    req.body.password2 == "" || req.body.password2 == null){
        req.flash('error', 'Please fill out all fields')
        return res.redirect('/login/register')
    }

    if(req.body.password != req.body.password2){
        req.flash('error', 'Password mismatch')
        return res.redirect('/login/register')
    }

    const username = req.body.username;
    const email = username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    User.findOne({email: email})
        .then( userDoc =>{
            if(userDoc){
                req.flash('error', 'Someone with that username already exists')
                return res.redirect('/login/authenticateFail');
            }
            return bcrypt.hash(password, 12)
            .then(hashedPassword =>{
                var authUID = uuid.v4();

                // then send the email
                let message = {
                    from: process.env.NODEMAILER_EMAIL,
                    to: email,
                    subject: "MocsArcade: Verify your email",
                    html: `
                            Thank you for joining the Mocs Arcade initiative! Click the link below to verify your email!
                            
                            https://mocsarcade.herokuapp.com/login/authenticate/${authUID}
                        `
                };

                const newUser = new User({
                    username: username, 
                    password: hashedPassword, 
                    firstName: firstName, 
                    lastName: lastName,
                    email: email,
                    isAdmin: false,
                    isAuthorized: false,
                    authenticationCode: authUID
                })
                // Attempt to send verification email
                if (transporter != null) {
                    return transporter
                        .sendMail(message)
                        .then(() => {
                            return newUser.save().catch();
                        })
                        .catch((error) => console.error(error));
                }
                else {
                    // If we can't send verification email due to config problems, let it go
                    newUser.isAuthenticated = true
                    return newUser.save().catch();
                }
            });
                
        })
        .then(result => {
            res.redirect('/login')
        })
        .catch(err => {
            console.log(err)
        })
}

exports.authenticate = (req, res, next) => {
    User.findOne({ authenticationCode: req.params.authenticationCode })
        .then( user =>{
            if(user == null){
                req.flash('error', 'URL is not valid. Double-check url and try again. If problems persist, please contact admin')
                return res.redirect('/login/register');
            }
            user.isAuthenticated = true;
            user.save();
            return res.render('login/authentication', {pageTitle: 'Verified'})
        })
        .catch(err => {
            console.log(err)
        })
}

exports.logout = (req, res, next) => {
    req.session.destroy(()=>{
        res.redirect('/')
    })
}