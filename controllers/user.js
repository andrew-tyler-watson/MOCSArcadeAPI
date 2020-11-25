const User = require('../models/user');
const Game = require('../models/game')
const mongoose = require('mongoose')

var fs = require('fs'); 
var path = require('path'); 

function saveImage(game, req){
    game.gameInfo.gameplayPreview = { 
        data: fs.readFileSync(path.join(process.cwd() + '/uploads/' + req.file.filename)), 
        contentType: 'image/png'
    }
}

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
                    
                    res.render('user/allGames', { user: user,
                                                  games: games,
                                                  pageTitle: 'Games',
                                                  message: message})
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
                    
                    res.render('user/myGames', { user: user,
                                                 games: games,
                                                 pageTitle: 'My Games',
                                                 message: message})
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
                    
                    res.render('user/details', { user: user,
                                                 game: game,
                                                 pageTitle: game.gameInfo.name,
                                                 message: message,
                                                 isEdit: req.isEdit})
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

            /**
             * making the game info and creationDate
             */

            const today = new Date();
            const creationDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

            const gameInfo = {
                name: req.body.gameName,
                description: req.body.gameDescription
            }

            /**
             * Adding the revision History here
             */

            const version = req.body.gameAddVersion

            const firstRevision = {
                releaseNotes: req.body.gameReleaseNotes,
                isActive: true,
                version: version
            }

            if(req.body.gameHost.toLowerCase() === "google drive"){
                firstRevision.isGoogleDriveDownload = true
                firstRevision.fileId = req.body.gameUrlOrFileId
            }
            else{
                firstRevision.isHttpDownload = true
                firstRevision.url = req.body.gameUrlOrFileId
            }



            const revisionHistory = {
                revisions : [firstRevision]
            }

            /**
             * saving the game
             */
            const newGame = new Game({
                gameInfo: gameInfo,
                creationDate: creationDate,
                userId: user._id,
                revisionHistory: revisionHistory,
                isActive: true
            })

            if (typeof req.file != "undefined") {
                saveImage(newGame, req)
             }

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
                    if (existingGame != null && existingGame._id.toString() != game._id.toString()) {
                        /**
                         * Error for attempting to edit/create a game of the same name
                         */
                        req.flash('uploadError', 'This game name is taken, please choose another')
                        res.redirect('/user/details/' + game._id.toString());
                    }
                    else if (game.userId.toString() != user._id.toString() && !user.isAdmin) {
                        /**
                         * Error for attempting to edit/create a game you don't own
                         */
                        req.flash('uploadError', 'You don\'t have proper permissions to update this game')
                        res.redirect('/user/details/' + game._id.toString());
                    }
                    else {
                        /**
                         * Editting game data
                         */
                        game.gameInfo.name = req.body.name;
                        game.gameInfo.description = req.body.description;
                        if (typeof req.file != "undefined") {
                           saveImage(game, req)
                        }

                        /**
                         * Editting version data
                         */
                        for (i = 0; i < game.revisionHistory.revisions.length; i++) {
                            var versionNum = game.revisionHistory.revisions[i].version;
                            if (game.revisionHistory.revisions[i].releaseNotes != req.body.releaseNotes[versionNum]) {
                                game.revisionHistory.revisions[i].releaseNotes = req.body.releaseNotes[versionNum];
                                game.markModified('revisionHistory.revisions');
                            }
                            if (req.body.fileId) {
                                if (req.body.fileId[versionNum]) {
                                    if (game.revisionHistory.revisions[i].fileId != req.body.fileId[versionNum]) {
                                        game.revisionHistory.revisions[i].fileId = req.body.fileId[versionNum];
                                        game.markModified('revisionHistory.revisions');
                                    }
                                }
                            }
                            if (req.body.url) {
                                if (req.body.url[versionNum]) {
                                    if (game.revisionHistory.revisions[i].url != req.body.url[versionNum]) {
                                        game.revisionHistory.revisions[i].url = req.body.url[versionNum];
                                        game.markModified('revisionHistory.revisions');
                                    }
                                }
                            }
                            if (req.body.deactivate) {
                                if (req.body.deactivate[versionNum]) {
                                    if (game.revisionHistory.revisions[i].isActive) {
                                        game.revisionHistory.revisions[i].isActive = false;
                                        game.markModified('revisionHistory.revisions');
                                    }
                                } else {
                                    if (!game.revisionHistory.revisions[i].isActive) {
                                        game.revisionHistory.revisions[i].isActive = true;
                                        game.markModified('revisionHistory.revisions');
                                    }
                                }
                            }
                            if (req.body.destabilize) {
                                if (req.body.destabilize[versionNum]) {
                                    if (game.revisionHistory.revisions[i].isStable) {
                                        game.revisionHistory.revisions[i].isStable = false;
                                        game.markModified('revisionHistory.revisions');
                                    }
                                } else {
                                    if (!game.revisionHistory.revisions[i].isStable) {
                                        game.revisionHistory.revisions[i].isStable = true;
                                        game.markModified('revisionHistory.revisions');
                                    }
                                }
                            }
                        }

                        /**
                         * Adding new version
                         */
                        if (req.body.newVersionName) {
                            var newRevision = {
                                releaseNotes: req.body.newVersionNotes,
                                isActive: true,
                                version:  req.body.newVersionName
                            }
                            if(req.body.newVersionHost.toLowerCase() === "google drive download"){
                                newRevision.isGoogleDriveDownload = true
                                newRevision.fileId = req.body.newVersionURL
                            }
                            else{
                                newRevision.isHttpDownload = true
                                newRevision.url = req.body.newVersionURL
                            }
                            game.revisionHistory.revisions.push(newRevision)
                            game.markModified('revisionHistory.revisions');
                        }
        
                        /**
                         * Saving the game
                         */
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

exports.editUser = (req, res, next) => {
    req.isEdit = true;
    exports.userDetails(req, res, next);
}
exports.userDetails = (req, res, next) => {
    if(!req.isEdit) {
        req.isEdit = false
    }
    //load the current user
    User.findOne({ _id: req.params.userid }).then(
        user => {
            Game.find()
                .where('userId').equals(user._id)
                .where('isActive').equals(true)
                .then(games => {
                    let message = req.flash('uploadError');
                    if(message.length > 0){
                        message = message[0]
                    }
                    else{
                        message = null;
                    }
                    
                    res.render('user/userDetails', { user: user,
                                                      games: games,
                                                      pageTitle: user.firstName + " " + user.lastName,
                                                      message: message,
                                                      isEdit: req.isEdit,
                                                      isPageUser: (req.session.username == user.username)})
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

exports.uploadUser = (req, res, next) => {
    //load the current user
    User.findOne({ username: req.session.username }).then(user => {
        // Edit user
        User.findOne({ name: req.body.userid }).then(updateUser => {
            // Test for user priveleges and name uniqueness 
            if(updateUser._id.toString() != user._id.toString() && !user.isAdmin) {
                req.flash('uploadError', 'You don\'t have proper permissions to update this game')
                res.redirect('/user/details/' + game._id.toString());
            }
            else {
                // Edit exising game
                user.bio = req.body.bio;

                user
                    .save()
                    .then(result => {
                        res.redirect('/user/user/' + user._id.toString());
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