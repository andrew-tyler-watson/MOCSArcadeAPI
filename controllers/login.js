const User = require('../models/user');

exports.login = (req, res, next) =>{
    res.render('login/login', {
        pageTitle: 'Welcome!!!'
    })
}

exports.doLogin = (req, res, next) => {
    const user = req.body.username;
    const pass = req.body.password;


    const success = User.authenticate(user, pass);

    if(success){
        //save user details in cookie

        res.redirect('/upload')
    }
    else{

    }
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