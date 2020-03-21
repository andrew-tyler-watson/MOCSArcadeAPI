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
                game.key = count.toString();
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
    const gameName = req.body.name;
    const fileId = req.body.fileId;
    const description = req.body.description;
    const today = new Date();
    const creationDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    const newGame = new Game({
        name: gameName,
        fileId: fileId,
        description: description,
        creationDate: creationDate,
        userId: '5e6e9fa9b6ee250f5155a99b',
        shouldUpdate: true
    })

    newGame
        .save()
        .then(result => { 
            res.redirect('/user')
        })

    res.redirect('/user')
}

exports.update = (req, res, next) => {
    Game.findById(req.body.gameToUpdateId)
    .then(game =>{
        game.fileId = req.body.newFileId;
        game.shouldUpdate = true;
        return game.save();
    }).then(result =>{
        res.redirect('/user')
    })

    
}

exports.delete = (req, res, next) => {
    //load the current user
    console.log(req.body.gameId)
    Game.findByIdAndRemove(req.body.gameId)
    .then(()=>{
        res.redirect('/user');
    })
    .catch((err)=>{
        console.log(err)
    })
    
}