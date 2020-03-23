const User = require('../models/user');
const Game = require('../models/game')
const mongoose = require('mongoose')


exports.games = (req, res, next) => {
    //load the current user
    User.findOne({ username: req.session.username }).then(
        user => {
            console.log(user)
            Game.find()
                .where('userId').equals(user._id)
                .then(games => {

                    let count = 0;
                    for (var game in games) {
                        count++;
                        game.key = count.toString();
                    }
                    console.log(games);
                    res.render('user/games', { user: user, games: games, pageTitle: 'Games' })
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
                shouldUpdate: true
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
        });

}

exports.update = (req, res, next) => {
    Game.findById(req.body.gameToUpdateId)
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
    console.log(req.body.gameId)
    Game.findByIdAndRemove(req.body.gameId)
        .then(() => {
            res.redirect('/user');
        })
        .catch((err) => {
            console.log(err)
        })

}