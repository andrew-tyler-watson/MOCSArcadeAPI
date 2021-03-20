const User = require('../models/user')
const Game = require('../models/game')
const Report = require('../models/report')

exports.getAdminEditGames = (req, res, next) =>{
    User.findOne({username: req.session.username})
    .select("username firstName lastName isAdmin")
    .then(user =>{
        if(!user.isAdmin){
            res.redirect('/user')
        }
        Game.find()
        .where('isActive').equals(true)
        .populate('userId')
        .then(games =>{
            res.render('admin/admin', { user: user,
                                        games: games,
                                        editGames: true,
                                        pageTitle: 'Administration - Edit Games'})
        })
        
    })
    .catch(err =>{
        console.log(err)
    })

}
exports.getAdminEditUsers = (req, res, next) =>{
    User.findOne({username: req.session.username})
        .select("username firstName lastName isAdmin")
        .then(user =>{
            if(!user.isAdmin){
                res.redirect('/user')
            }
            User.find({username: {$ne: req.session.username}})
                .then(users =>{
                    res.render('admin/admin', { user: user,
                                                users: users,
                                                editGames: false,
                                                pageTitle: 'Administration - Edit Users'})
                })
        })
        .catch(err =>{
            console.log(err)
        })
}

exports.getAdminReportViewer = (req, res, next) =>{
    User.findOne({username: req.session.username})
    .select("username firstName lastName isAdmin")
    .then(user =>{
        if(!user.isAdmin){
            res.redirect('/user')
        }
        Report.find()
        .where('isActive').equals(true)
        .populate('gameId')
        .then(reports =>{
            res.render('admin/reports', {
                user: user,
                reports: reports,
                pageTitle: 'Administration - View Reports'})
        })
        
    })
    .catch(err =>{
        console.log(err)
    })

}

exports.postPromote = (req, res, next) =>{
    User.findOne({username: req.body.username})
    .then(user => {
        user.isAdmin = true;
        return user.save()
    })
    .then(result =>{
        res.redirect('/admin/editUsers')
    })
    .catch(err => {
        console.log(err)
    })

}
exports.postDemote = (req, res, next) =>{
    User.findOne({username: req.body.username})
    .then(user => {
        user.isAdmin = false;
        return user.save()
    })
    .then(result =>{
        res.redirect('/admin/editUsers')
    })
    .catch(err => {
        console.log(err)
    })
}

exports.postDelete = (req, res, next) =>{
    User.findOne({username: req.body.username})
    .then(user => {
        return user.remove()
    })
    .then(result =>{
        res.redirect('/admin/editUsers')
    })
    .catch(err => {
        console.log(err)
    })
}

exports.postApprove = (req, res, next) =>{
    console.log("approve received")
    Game.findOne({_id: req.body.gameID})
    .populate('userId')
    .then(game => {
        game.isApproved = true;
        return game.save()
    })
    .then(result =>{
        console.log(req.body.redirectTo)
        res.redirect(req.body.redirectTo)
    })
    .catch(err => {
        console.log(err)
    })
}
exports.postRevoke = (req, res, next) =>{
    console.log("revoke received")
    Game.findOne({_id: req.body.gameID})
    .populate('userId')
    .then(game => {
        game.isApproved = false;
        return game.save()
    })
    .then(result =>{
        res.redirect(req.body.redirectTo)
    })
    .catch(err => {
        console.log(err)
    })
}
exports.postCloseReport = (req, res, next) =>{
    Report.findOne({_id: req.body.reportID})
    .then(report => {
        report.isActive = false;
        return report.save()
    })
    .then(result =>{
        res.redirect('/admin/viewReports')
    })
    .catch(err => {
        console.log(err)
    })
}
