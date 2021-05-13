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
                        game = game.gameplayPreviews = []
                    }
                    
                    )
                res.send(games)
            }
        )
        .catch(err => {
            console.log(err)
        })

}

exports.keybinds = (req, res, next) => {
    //load the game
    Game.find()
        .where('gameInfo.name').equals(req.params.gameName)
        .where('isActive').equals(true)
        .then(games => {
            // Create editable copy of the keybinds dictionary
            var ret = {...games[0].keybinds};
            ret['Title'] = games[0].gameInfo.title;
            res.json(ret);
        })
        .catch(err => {
            console.log(err)
        });
}