const Game = require('../models/game')
const mongoose = require('mongoose')

var axios = require('axios')
var fs = require('fs'); 
var path = require('path'); 

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

exports.download = (req, res, next) => {
    //load the game's versions
    Game.findOne({ 'gameInfo.name': req.params.gameName })
        .then(game => {
            if(game == null || !game.isActive) {
                res.status(410).send('No game with that name is available');
                return;
            }
            if(req.params.versionName) {
                var versionIndex = game.revisionHistory.revisions.findIndex(
                    (element) => element.version == req.params.versionName
                )
                if(versionIndex == -1) {
                    res.status(404).send('Version not found');
                } else {
                    downloadGame(game, res, versionIndex, false)
                }
            } else {
                // Download the latest reachable version
                downloadGame(game, res, game.revisionHistory.revisions.length-1)
            }
        })
        .catch(err => {
            console.log(err)
        });
}

// Recursive function that downloads versions from newest to oldest
// Starting version index should be the index of the last revision (revisions.length-1)
function downloadGame(game, res, versionIndex, recurse=true){
    if(versionIndex < 0) {
        res.status(422).send('This game has no working version endpoints');
        return;
    }
    if(game.revisionHistory.revisions[versionIndex].isActive) {
        var requestURL = "";
        if(game.revisionHistory.revisions[versionIndex].isGoogleDriveDownload) {
            requestURL = "https://drive.google.com/uc?export=download&id=" + game.revisionHistory.revisions[versionIndex].fileId
        }
        if(game.revisionHistory.revisions[versionIndex].isHttpDownload) {
            requestURL = game.revisionHistory.revisions[versionIndex].url
        }

        // Download drive zip
        axios({
                method: 'get',
                url: requestURL,
                responseType: 'stream'
            })
            .then(function(response) {
                res.setHeader('Content-disposition', 'attachment; filename=game.zip');
                res.setHeader('Content-type', 'application/zip');
                response.data.pipe(res);
            })
            .catch(function(response) {
                // If request fails: Go to next revision type
                if(recurse)
                    downloadGame(game, res, versionIndex-1)
                else
                    res.status(500).send('Requested version cannot be downloaded');
            })
    } else {
        if(recurse)
            downloadGame(game, res, versionIndex-1)
        else
            res.status(500).send('Requested version is inactive')
    }
}
