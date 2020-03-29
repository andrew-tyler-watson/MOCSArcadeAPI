/**
 * These are middlewares we use to protect our routes
 * - if you go to any route file, you see that we first pass our 
 * -- request through some of these middle wares before we actually 
 * -- pass the request to the controller
 */

exports.isLoggedIn = (req, res, next) =>{
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    next();
}

exports.isAdmin = (req, res, next) =>{
    if(!req.session.isAdmin){
        return res.redirect('/user')
    }
    next();
}

exports.isNotLoggedIn = (req, res, next) => {
    if(req.session.isLoggedIn){
        return res.redirect('/user');
    }
    next();
}