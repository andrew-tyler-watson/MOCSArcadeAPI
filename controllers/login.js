const User = require('../models/user');

exports.login = (req, res, next) =>{
    if(!req.session.isLoggedIn){
        console.log(req.session)
        res.render('login/login', {
            pageTitle: 'Welcome!!!'
        })
    }
    else{
        res.redirect('/user')
    }
    
}

exports.postLogin = (req, res, next) => {
    const user = req.body.username;
    const pass = req.body.password;

   
        //save user details in cookie
        req.session.isLoggedIn = true
        req.session.username = user
        res.redirect('/user')
}

exports.register = (req, res, next) => {
    res.render('login/register', {pageTitle: 'Register'})
}

exports.doRegistration = (req, res, next) => {
    const username = req.body.username;
    const email = username + req.body.domain;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    let newUser = new User({
        username: username, 
        password: password, 
        firstName: firstName, 
        lastName: lastName,
        email: email,
        isAdmin: false
    });

    newUser.save()
    .then()
    .catch(err => {
        console.log(err)
    });
    res.redirect('/user');
}

exports.logout = (req, res, next) => {
    req.session.destroy(()=>{
        res.redirect('/')
    })

    
}