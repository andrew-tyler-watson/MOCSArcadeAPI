const User = require('../models/user')
const Game = require('../models/game')

exports.getAdmin = (req, res, next) =>{
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
                                        pageTitle: 'Administration'})
        })
        
    })
    .catch(err =>{
        console.log(err)
    })

}
exports.postAdminApprove = (req, res, next) =>{
    const gameId = req.body.gameId
    Game.findById(gameId)
    .then(game =>{
        game.isApproved = true;
        game.save()
        .then(result => {
            res.redirect('/admin')
        })
        .catch(err => {
            console.log(err)
        });
    })
    .catch( err =>{
        console.log(err)
    })
}
exports.postAdminDelete = (req, res, next) =>{
    
}
exports.postAdminElevate = (req, res, next) =>{

}