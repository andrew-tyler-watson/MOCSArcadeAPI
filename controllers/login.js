const User = require('../models/user');
const bcrypt = require('bcryptjs')

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
    res.render('login/register', {pageTitle: 'Register'})
}

exports.postRegister = (req, res, next) => {
    const username = req.body.username;
    const email = username + req.body.domain;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    User.findOne({email: email})
        .then( userDoc =>{
            if(userDoc){
                return res.redirect('/register');
            }
            return bcrypt.hash(password, 12)
            .then(hashedPassword =>{
                const newUser = new User({
                    username: username, 
                    password: hashedPassword, 
                    firstName: firstName, 
                    lastName: lastName,
                    email: email,
                    isAdmin: false,
                    isAuthorized: false
                })
                return newUser.save();
            });
                
        })
        .then(result => {
            res.redirect('/login')
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