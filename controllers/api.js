const Game = require('../models/game')
const User = require('../models/user')
const mongoose = require('mongoose')

var axios = require('axios')

exports.games = (req, res, next) => {
    Game.find({isActive: true, isApproved: true})
        .select('gameInfo.name gameInfo.title gameInfo.description revisionHistory creationDate userId')
        .populate('userId', 'username firstName lastName')
        .then(
            (games) => {
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

exports.numPreviews = (req, res, next) => {
    Game.findOne({ 'gameInfo.name': new RegExp('^' + req.params.gameName + '$', 'i'), 'isActive': true })
        .then(game => {
                if(game != null) {
                    res.send(game.gameplayPreviews.length.toString())
                } else {
                    console.log("Requested game", req.params.gameName, "could not be found")
                    res.status(500).send('Requested game could not be found');
                }
            }
        )
        .catch(err => {
            console.log(err)
            res.status(500).send('Requested game could not be found');
        })

}

exports.downloadPreview = (req, res, next) => {
    Game.findOne({ 'gameInfo.name': new RegExp('^' + req.params.gameName + '$', 'i'), 'isActive': true })
        .then(game => {
            if(game != null) {
                var requestURL = "https://drive.google.com/uc?export=download&id=" + game.gameplayPreviews[req.params.previewNumber].driveId
                axios({
                        method: 'get',
                        url: requestURL,
                        responseType: 'stream'
                    })
                    .then(function(response) {
                        res.setHeader('Content-disposition', 'attachment');
                        res.setHeader('Content-type', 'image/bmp');
                        response.data.pipe(res);
                    })
                    .catch(function(response) {
                        res.status(500).send('Requested preview image cannot be downloaded');
                    })
            } else {
                console.log("Requested game", req.params.gameName, "could not be found")
                res.status(500).send('Requested game could not be found');
            }
        })
        .catch(err => {
            console.log(err)
        })

}