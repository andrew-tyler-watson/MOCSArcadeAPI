const User = require('../models/user');
const Game = require('../models/game')
const mongoose = require('mongoose')

exports.allGames = (req, res, next) => {
    //load the current user
    User.findOne({ username: req.session.username }).then(
        user => {
            Game.find()
                .where('isActive').equals(true)
                .where('isApproved').equals(true)
                .populate('userId')
                .then(games => {
                    let message = req.flash('uploadError');
                    if(message.length > 0){
                        message = message[0]
                    }
                    else{
                        message = null;
                    }
                    
                    res.render('user/allGames', { user: user,
                                                  games: games,
                                                  pageTitle: 'Games',
                                                  message: message})
                })
                .catch(err => {
                    console.log(err)
                });
        }
    )
        .catch(err => {
            console.log(err)
        });

}

//168k4wP0gE4OC2u2QkW42Tc6ust8T2ULh
exports.games = (req, res, next) => {
    //load the current user
    User.findOne({ username: req.session.username }).then(
        user => {
            Game.find()
                .where('userId').equals(user._id)
                .where('isActive').equals(true)
                .where('isApproved').equals(true)
                .populate('userId')
                .then(games => {
                    let message = req.flash('uploadError');
                    if(message.length > 0){
                        message = message[0]
                    }
                    else{
                        message = null;
                    }
                    
                    res.render('user/myGames', { user: user,
                                                 games: games,
                                                 pageTitle: 'My Games',
                                                 message: message})
                })
                .catch(err => {
                    console.log(err)
                });
        }
    )
        .catch(err => {
            console.log(err)
        });

}

exports.editUser = (req, res, next) => {
    req.isEdit = true;
    exports.userDetails(req, res, next);
}
exports.userDetails = (req, res, next) => {
    if(!req.isEdit) {
        req.isEdit = false
    }
    //load the current user
    User.findOne({ _id: req.params.userid }).then(
        user => {
            Game.find()
                .where('userId').equals(user._id)
                .where('isActive').equals(true)
                .then(games => {
                    let message = req.flash('uploadError');
                    if(message.length > 0){
                        message = message[0]
                    }
                    else{
                        message = null;
                    }
                    
                    res.render('user/userDetails', { user: user,
                                                      games: games,
                                                      pageTitle: user.firstName + " " + user.lastName,
                                                      message: message,
                                                      isEdit: req.isEdit,
                                                      isPageUser: (req.session.username == user.username)})
                })
                .catch(err => {
                    console.log(err)
                });
        }
    )
    .catch(err => {
        console.log(err)
    });

}

exports.uploadUser = (req, res, next) => {
    //load the current user
    User.findOne({ username: req.session.username }).then(user => {
        // Edit user
        User.findOne({ name: req.body.userid }).then(updateUser => {
            // Test for user priveleges and name uniqueness 
            if(updateUser._id.toString() != user._id.toString() && !user.isAdmin) {
                req.flash('uploadError', 'You don\'t have proper permissions to update this game')
                res.redirect('/game/details/' + game._id.toString());
            }
            else {
                // Edit exising game
                user.bio = req.body.bio;

                user
                    .save()
                    .then(result => {
                        res.redirect('/user/user/' + user._id.toString());
                    });
            }
        })
        .catch(err => {
            console.log(err)
        })
    })
    .catch(err => {
        console.log(err)
    })
}

exports.help = (req, res, next) =>{
    User.findOne({ username: req.session.username }).then(
        user => {
            res.render('user/help', {user: user, pageTitle: 'Help'})
        }
    )
        .catch(err => {
            console.log(err)
        });
}