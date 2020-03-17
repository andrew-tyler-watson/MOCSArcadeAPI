const User = require('../models/user');
const Game = require('../models/game')
const mongoose = require('mongoose')

exports.games = (req, res, next) => {
    //load the current user

    Game.find()
        .then(games => {

            let count = 0;
            for(var game in games){
                count++;
                game.key = count;
            }
            console.log(games);
            res.render('user/games', { user: {isAdmin: true}, userGames: games, pageTitle: 'Games' })
        })
        .catch(err => {
            console.log(err)
        });
}

exports.upload = (req, res, next) => {
    //load the current user
    res.render('user/upload',
        { currentUser: User, userGames: userGames, pageTitle: 'Upload' }
    );
}

exports.update = (req, res, next) => {
    //load the current user
    res.render('user/upload',
        { currentUser: User, userGames: userGames, pageTitle: 'Upload' }
    );
}

exports.delete = (req, res, next) => {
    //load the current user
    res.render('user/upload',
        { currentUser: User, userGames: userGames, pageTitle: 'Upload' }
    );
}