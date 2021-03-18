const Game = require('../models/game')
const User = require('../models/user')
const mongoose = require('mongoose')


exports.games = (req, res, next) => {
    Game.find()
        .populate('userId')
        .then(
            (games) => {
                games.forEach(
                    game => { 
                        game = game.gameInfo.gameplayPreview = {}
                    }
                    
                    )
                res.send(games)
            }
        )
        .catch(err => {
            console.log(err)
        })

}
