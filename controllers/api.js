const Game = require('../models/game')
const mongoose = require('mongoose')


exports.games = (req, res, next) => {

    var games = [];

    Game.find()
    .then(
        (games) =>{
        
            res.send(games)
            console.log(games)
        }
    )
    .catch(err => {
        console.log(err)
    })

}