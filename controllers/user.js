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
                .populate('userID')
                .then(games => {
                    let message = req.flash('uploadError');
                    if(message.length > 0){
                        message = message[0]
                    }
                    else{
                        message = null;
                    }
                    
                    res.render('user/allGames', { user: user, games: games, pageTitle: 'Games', message: message})
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
                .where('UserId').equals(user._id)
                .where('isActive').equals(true)
                .where('isApproved').equals(true)
                .populate('userID')
                .then(games => {
                    let message = req.flash('uploadError');
                    if(message.length > 0){
                        message = message[0]
                    }
                    else{
                        message = null;
                    }
                    
                    res.render('user/myGames', { user: user, games: games, pageTitle: 'My Games', message: message})
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

exports.edit = (req, res, next) => {
    req.isEdit = true;
    exports.details(req, res, next);
}

exports.details = (req, res, next) => {
    if(!req.isEdit) {
        req.isEdit = false
    }
    //load the current user
    User.findOne({ username: req.session.username }).then(
        user => {
            Game.findOne({ _id: req.params.gameid }).then(
                game => {
                    let message = req.flash('uploadError');
                    if(message.length > 0){
                        message = message[0]
                    }
                    else{
                        message = null;
                    }
                    
                    res.render('user/details', { user: user, game: game, pageTitle: game.gameInfo.name, message: message, isEdit: req.isEdit})
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

exports.upload = (req, res, next) => {
    //load the current user
    User.findOne({ username: req.session.username }).then(user => {
        if (req.body.gameID == null) {
            console.log("Creating game")
            // Upload new game
            const gameName = req.body.name;
            const description = req.body.description;
            const today = new Date();
            const creationDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

            const newGame = new Game({
                name: gameName,
                description: description,
                creationDate: creationDate,
                userId: user._id,
                isActive: true
            })
            newGame
                .save()
                .then(result => {
                    res.redirect('/user/details/' + newGame._id.toString());
                })
                .catch(err => {
                    console.log(err)
                });
        }
        else {
            // Edit game
            Game.findOne({ name: req.body.name }).then(existingGame => {
                Game.findOne({ _id: req.body.gameID }).then(game => {
                    // Test for user priveleges and name uniqueness 
                    if(game.userId.toString() != user._id.toString()
                        || (existingGame != null && existingGame._id.toString() != game._id.toString())) {
                        // Error for attempting to edit/create a game of the same name
                        req.flash('uploadError', 'This game name is taken, please choose another')
                        res.redirect('/user/details/' + game._id.toString());
                    }
                    else {
                        // Edit exising game
                        game.gameInfo.name = req.body.name;
                        game.gameInfo.description = req.body.description;
        
                        game
                            .save()
                            .then(result => {
                                res.redirect('/user/details/' + game._id.toString());
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
    })
    .catch(err => {
        console.log(err)
    })
}

exports.delete = (req, res, next) => {
    //load the current user

    Game.findOne({_id: req.body.gameID})
        .then(game => {
            game.isActive = false;

            return game.save();

        })
        .then(result =>{
            res.redirect('/user');
        })
        .catch((err) => {
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