const User = require('../models/user');
const Game = require('../models/game')
const Report = require('../models/report')
const Rating = require('../models/rating')
const Comment = require('../models/comment')
const mongoose = require('mongoose')

var axios = require('axios')
var fs = require('fs'); 
var path = require('path');

function saveImage(game, req){
    game.gameInfo.gameplayPreview = { 
        data: fs.readFileSync(path.join(process.cwd() + '/uploads/' + req.file.filename)), 
        contentType: 'image/png'
    }
}

/**
 * Email system for sending email authentication emails
 */
 const nodemailer = require('nodemailer');

 let transporter = null
 if(process.env.NODEMAILER_EMAIL){
     transporter = nodemailer.createTransport({
     service: "gmail",
     auth: {
         type: 'OAuth2',
         user: process.env.NODEMAILER_EMAIL,
         clientId: process.env.CLIENT_ID,
         clientSecret: process.env.CLIENT_SECRET,
         refreshToken: process.env.REFRESH_TOKEN,
         accessToken: process.env.ACCESS_TOKEN,
         expires: Number.parseInt(process.env.TOKEN_EXPIRE, 10),
     },
     });
 }

 exports.comment = (req, res, next) => {
     //load the game's versions
     Game.findOne({ '_id': req.body.gameId })
         .then(game => {
            if(game == null || !game.isActive) {
                res.status(410).json({status:'That game is not available or does not exist'});
                return;
            }

            // Create new rating
            const today = new Date();
            const comment = new Comment({
                gameId: req.body.gameId,
                comment: req.body.comment,
                userId: req.body.userId,
                creationDate: today
            })

            comment
                .save()
                .then(result => {
                    res.status(200).json({status:"OK"});
                    return;
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({status:'The comment could not be saved. Please try again'});
                    return;
                });
         })
         .catch(err => {
             console.log(err)
             res.status(500).json({status:'The comment could not be saved. Please try again'});
             return;
         });
 }

exports.rate = (req, res, next) => {
    //load the game's versions
    Game.findOne({ '_id': req.body.gameId })
        .then(game => {
            if(game == null || !game.isActive) {
                res.status(410).json({status:'That game is not available or does not exist'});
                return;
            }
            // Check if user has existing rating
            Rating.findOne({ userId: req.body.userId, gameId: req.body.gameId })
                .then(oldRating => {
                    // Delete old rating (if it exists)
                    if(oldRating != null) {
                        oldRating.remove()
                    }

                    // Create new rating
                    const rating = new Rating({
                        gameId: req.body.gameId,
                        rating: req.body.rating,
                        userId: req.body.userId
                    })
        
                    rating
                        .save()
                        .then(result => {
                            res.status(200).json({status:"OK"});
                            return;
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({status:'The rating could not be saved. Please try again'});
                            return;
                        });
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({status:'The rating could not be saved. Please try again'});
                    return;
                });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({status:'The rating could not be saved. Please try again'});
            return;
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
            Game.findOne({ _id: req.params.gameid })
                .populate('userId')
                .then(game => {
                    Rating.findOne({ userId: user._id, gameId: game._id })
                        .then(stars => {
                            Comment.find({ gameId: game._id })
                                .populate('userId')
                                .then(comments => {
                                    let message = req.flash('uploadError');
                                    message = (message.length > 0) ? message[0] : null;

                                    let successMessage = req.flash('uploadMsg');
                                    successMessage = (successMessage.length > 0) ? successMessage[0] : null;
                                    
                                    res.render('game/details', { user: user,
                                                                game: game,
                                                                pageTitle: game.gameInfo.name,
                                                                message: message,
                                                                successMessage: successMessage,
                                                                isEdit: req.isEdit,
                                                                rating: stars ? stars.rating : null,
                                                                comments: comments})
                                })
                                .catch(err => {
                                    console.log(err)
                                });
                        })
                        .catch(err => {
                            console.log(err)
                        });
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
                description: req.body.gameDescription,
                title: req.body.title
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
             * Keybinds
             */

            const keybinds = {
                P1up : req.body.P1up,
                P1left : req.body.P1left,
                P1right : req.body.P1right,
                P1down : req.body.P1down,
                P1A : req.body.P1A,
                P1B : req.body.P1B,
                P1X : req.body.P1X,
                P1Y : req.body.P1Y,
                P1Z : req.body.P1Z,

                P2up : req.body.P2up,
                P2left : req.body.P2left,
                P2right : req.body.P2right,
                P2down : req.body.P2down,
                P2A : req.body.P2A,
                P2B : req.body.P2B,
                P2X : req.body.P2X,
                P2Y : req.body.P2Y,
                P2Z : req.body.P2Z,

                Start : req.body.KeybindStart,
                Exit : req.body.KeybindExit
            }

            /**
             * saving the game
             */
            const newGame = new Game({
                gameInfo: gameInfo,
                creationDate: creationDate,
                userId: user._id,
                revisionHistory: revisionHistory,
                isActive: true,
                keybinds: keybinds
            })

            if (typeof req.file != "undefined") {
                saveImage(newGame, req)
            }

            newGame
                .save()
                .then(result => {
                    User.find()
                        .where('isAdmin').equals(true)
                        .then(users => {
                            var emails = [];
                            users.forEach(function(adminUser){
                                emails.push(adminUser.email);
                            });

                            // then send email to admin
                            let message = {
                                from: process.env.NODEMAILER_EMAIL,
                                to: emails,
                                subject: "MocsArcade: New game to review",
                                html: `
                                        <p>
                                            Admin,
                                            <br><br>
                                            A new game has been added to the MocsArcade by ${user.username}
                                            <br>
                                            <b>Game name:</b> ${newGame.gameInfo.name}
                                            <br>
                                            <b>Description:</b> ${newGame.gameInfo.description}
                                        </p>
                                    `
                            };
                            // Attempt to send email to admin
                            if (transporter != null) {
                                transporter
                                    .sendMail(message)
                                    .then(() => {
                                        res.redirect('/game/details/' + newGame._id.toString());
                                    })
                                    .catch((error) => {
                                        console.error(error)
                                        res.redirect('/game/details/' + newGame._id.toString());
                                    });
                            }
                        })
                })
                .catch(err => {
                    console.log(err)
                });
        }
        else {
            // Edit game
            Game.findOne({ 'gameInfo.name': req.body.name }).then(existingGame => {
                Game.findOne({ _id: req.body.gameID }).then(game => {
                    // Test for user priveleges and name uniqueness 
                    if (existingGame != null && existingGame._id.toString() != game._id.toString()) {
                        /**
                         * Error for attempting to edit/create a game of the same name
                         */
                        req.flash('uploadError', 'This game name is taken, please choose another')
                        res.redirect('/game/details/' + game._id.toString());
                    }
                    else if (game.userId.toString() != user._id.toString() && !user.isAdmin) {
                        /**
                         * Error for attempting to edit/create a game you don't own
                         */
                        req.flash('uploadError', 'You don\'t have proper permissions to update this game')
                        res.redirect('/game/details/' + game._id.toString());
                    }
                    else {
                        /**
                         * Editting game data
                         */
                        game.gameInfo.name = req.body.name;
                        game.gameInfo.description = req.body.description;
                        game.gameInfo.title = req.body.title;
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
                            if (req.body.deactivate && req.body.deactivate[versionNum]) {
                                if (game.revisionHistory.revisions[i].isActive == true && req.body.deactivate[versionNum] == "true") {
                                    game.revisionHistory.revisions[i].isActive = false;
                                    game.markModified('revisionHistory.revisions');
                                }
                            } else {
                                if (!game.revisionHistory.revisions[i].isActive) {
                                    game.revisionHistory.revisions[i].isActive = true;
                                    game.markModified('revisionHistory.revisions');
                                }
                            }
                            if (req.body.destabilize && req.body.destabilize[versionNum]) {
                                if (game.revisionHistory.revisions[i].isStable && req.body.destabilize[versionNum] == "true") {
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
                         * Keybinds
                         */
            
                        game.keybinds = {
                            P1up : req.body.P1up,
                            P1left : req.body.P1left,
                            P1right : req.body.P1right,
                            P1down : req.body.P1down,
                            P1A : req.body.P1A,
                            P1B : req.body.P1B,
                            P1X : req.body.P1X,
                            P1Y : req.body.P1Y,
                            P1Z : req.body.P1Z,
            
                            P2up : req.body.P2up,
                            P2left : req.body.P2left,
                            P2right : req.body.P2right,
                            P2down : req.body.P2down,
                            P2A : req.body.P2A,
                            P2B : req.body.P2B,
                            P2X : req.body.P2X,
                            P2Y : req.body.P2Y,
                            P2Z : req.body.P2Z,

                            Start : req.body.KeybindStart,
                            Exit : req.body.KeybindExit
                        }
        
                        /**
                         * Saving the game
                         */
                        game
                            .save()
                            .then(result => {
                                res.redirect('/game/details/' + game._id.toString());
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

exports.report = (req, res, next) => {
    //load the game's versions
    Game.findOne({ '_id': req.body.gameId })
        .then(game => {
            if(game == null || !game.isActive) {
                req.flash('uploadError', 'That game is not available or does not exist')
                return res.redirect('/game/details/' + req.body.gameId)
            }
            /**
             * saving the game
             */
            const report = new Report({
                gameId: req.body.gameId,
                version: req.body.versionNumber,
                reportType: req.body.reportType,
                description: req.body.reportInfo,
            })

            report
                .save()
                .then(result => {
                    User.find()
                        .where('isAdmin').equals(true)
                        .then(users => {
                            var emails = [];
                            users.forEach(function(adminUser){
                                emails.push(adminUser.email);
                            });

                            // then send email to admin
                            let message = {
                                from: process.env.NODEMAILER_EMAIL,
                                to: emails,
                                subject: "MocsArcade: New game problem report",
                                html: `
                                        <p>
                                            Admin,
                                            <br><br>
                                            A new report has been flagged on the MocsArcade for ${game.gameInfo.name}
                                            <br><br>
                                            <b>Game name:</b> ${game.gameInfo.name}
                                            <br>
                                            <b>Report type:</b> ${req.body.reportType}
                                            <br>
                                            <b>Version:</b> ${req.body.versionNumber}
                                            <br>
                                            <b>Description:</b> ${req.body.reportInfo}
                                        </p>
                                    `
                            };
                            // Attempt to send email to admin
                            if (transporter != null) {
                                transporter
                                    .sendMail(message)
                                    .then(() => {
                                        req.flash('uploadMsg', 'Report has been submitted. Thank you for helping keep our game collection safe!')
                                        return res.redirect('/game/details/' + req.body.gameId)
                                    })
                                    .catch((error) => {
                                        console.error(error)
                                        req.flash('uploadMsg', 'Report has been submitted. Thank you for helping keep our game collection safe!')
                                        return res.redirect('/game/details/' + req.body.gameId)
                                    });
                            } else {
                                req.flash('uploadMsg', 'Report has been submitted. Thank you for helping keep our game collection safe!')
                                return res.redirect('/game/details/' + req.body.gameId)
                            }
                        })
                })
                .catch(err => {
                    console.log(err)
                    req.flash('uploadError', 'There was a problem reaching the server. Please try again later')
                    return res.redirect('/game/details/' + req.body.gameId)
                });
        })
        .catch(err => {
            console.log(err)
            req.flash('uploadError', 'There was a problem reaching the server. Please try again later')
            return res.redirect('/game/details/' + req.body.gameId)
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
