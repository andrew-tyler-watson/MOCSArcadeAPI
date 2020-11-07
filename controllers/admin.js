const User = require('../models/user')
const Game = require('../models/game')

exports.getAdminEditGames = (req, res, next) =>{
    User.findOne({username: req.session.username})
    .select("username firstName lastName isAdmin")
    .then(user =>{
        if(!user.isAdmin){
            res.redirect('/user')
        }
        Game.find()
        .where('isActive').equals(true)
        .where('isApproved').equals(false)
        .populate('userID')
        .then(games =>{
            res.render('admin/admin', { user: user,
                                        games: games,
                                        editGames: true,
                                        pageTitle: 'Administration - Edit Games'})
        })
        
    })
    .catch(err =>{
        console.log(err)
    })

}
exports.getAdminEditUsers = (req, res, next) =>{
    User.findOne({username: req.session.username})
    .select("username firstName lastName isAdmin")
    .then(user =>{
        if(!user.isAdmin){
            res.redirect('/user')
        }
        User.find({username: {$ne: req.session.username}})
        .then(users =>{
            res.render('admin/admin', { user: user,
                                        users: users,
                                        editGames: false,
                                        pageTitle: 'Administration - Edit Users'})
        })
        
    })
    .catch(err =>{
        console.log(err)
    })
}

exports.postPromote = (req, res, next) =>{
    User.findOne({username: req.body.username})
    .then(user => {
        user.isAdmin = true;
        return user.save()
    })
    .then(result =>{
        res.redirect('/admin/editUsers')
    })
    .catch(err => {
        console.log(err)
    })

}
exports.postDemote = (req, res, next) =>{
    User.findOne({username: req.body.username})
    .then(user => {
        user.isAdmin = false;
        return user.save()
    })
    .then(result =>{
        res.redirect('/admin/editUsers')
    })
    .catch(err => {
        console.log(err)
    })
}
exports.postAuthorize = (req, res, next) =>{
    User.findOne({username: req.body.username})
    .then(user => {
        user.isAuthorized = true;
        return user.save()
    })
    .then(result =>{
        res.redirect('/admin/editUsers')
    })
    .catch(err => {
        console.log(err)
    })
}

exports.postDeauthorize = (req, res, next) =>{
    User.findOne({username: req.body.username})
    .then(user => {
        user.isAuthorized = false;
        return user.save()
    })
    .then(result =>{
        res.redirect('/admin/editUsers')
    })
    .catch(err => {
        console.log(err)
    })
}
exports.postDelete = (req, res, next) =>{
    User.findOne({username: req.body.username})
    .then(user => {
        user.isAuthorized = false;
        return user.remove()
    })
    .then(result =>{
        res.redirect('/admin/editUsers')
    })
    .catch(err => {
        console.log(err)
    })
}

exports.postApprove = (req, res, next) =>{
    console.log("approve received")
    Game.findOne({_id: req.body.gameID})
    .populate('userID')
    .then(game => {
        game.isApproved = true;
        return game.save()
    })
    .then(result =>{
        res.redirect(req.body.redirectTo)
    })
    .catch(err => {
        console.log(err)
    })
}
exports.postRevoke = (req, res, next) =>{
    console.log("revoke received")
    Game.findOne({_id: req.body.gameID})
    .populate('userID')
    .then(game => {
        game.isApproved = false;
        return game.save()
    })
    .then(result =>{
        res.redirect(req.body.redirectTo)
    })
    .catch(err => {
        console.log(err)
    })
}