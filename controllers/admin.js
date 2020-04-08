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
    
}
exports.postDemote = (req, res, next) =>{
    
}
exports.postAuthorize = (req, res, next) =>{

}

exports.postDeauthorize = (req, res, next) =>{

}
exports.postDelete = (req, res, next) =>{

}