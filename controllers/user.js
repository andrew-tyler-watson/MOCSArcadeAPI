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
                    let count = 0;
                    for (var game in games) {
                        count++;
                        game.key = count.toString();
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
                .where('userId').equals(user._id)
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
                    let count = 0;
                    for (var game in games) {
                        count++;
                        game.key = count.toString();
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

exports.details = (req, res, next) => {
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
                    
                    res.render('user/details', { user: user, game: game, pageTitle: game.name, message: message, isEdit: false})
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

    Game.findOne({ name: req.body.name }).then(game => {
        if (game != null) {
            req.flash('uploadError', 'This game name is taken, please choose another')
            return res.redirect('/user');
        }
        else {
            User.findOne({ username: req.session.username }).then(
                user => {
                    const gameName = req.body.name;
                    const fileId = req.body.fileId;
                    const description = req.body.description;
                    const today = new Date();
                    const creationDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

                    const newGame = new Game({
                        name: gameName,
                        fileId: fileId,
                        description: description,
                        creationDate: creationDate,
                        userId: user._id,
                        shouldUpdate: true,
                        isActive: true
                    })
                    newGame
                        .save()
                        .then(result => {
                            res.redirect('/user')
                        })
                        .catch(err => {
                            console.log(err)
                        });
                }
            )
                .catch(err => {
                    console.log(err)
                })
        }
    }

    )
        .catch(err => {
            console.log(err)
        })

}

exports.update = (req, res, next) => {
    Game.findOne({name: req.body.gameName})
        .then(game => {
            game.fileId = req.body.newFileId;
            game.shouldUpdate = true;
            return game.save();
        }).then(result => {
            res.redirect('/user')
        })


}

exports.delete = (req, res, next) => {
    //load the current user

    Game.findOne({name: req.body.gameName})
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