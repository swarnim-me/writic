const User = require("../models/user");

var middleware = {
    isLoggedIn: function (req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
        else {
            req.flash('error', 'You must be logged in to do that');
            res.redirect('/auth/login');
        }
    },
    checkOwnership: function (req, res, next) {
        if (req.isAuthenticated()) {
            // console.log(req.params.username);
            if (req.user.username === req.params.username) {
                next();
            }
            else {
                req.flash('error', 'You are not permitted to do that');
                res.redirect('/');
            }
        }
        else {
            req.flash('error', 'You must be logged in to do that');
            res.redirect('/');
        }
    },
    isPublic: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.params.username === req.user.username) {
                next();
            }
            else {
                User.findOne({ username: req.params.username }, function (err, user) {
                    if (err) {
                        console.log(err);
                        res.redirect('back');
                    }
                    else {
                        if (user) {
                            if (user.show === 'public') {
                                next();
                            }
                            else {
                                req.flash('error', 'The user has a private account');
                                res.redirect('/');
                            }
                        }
                        else {
                            req.flash('error', 'User not found');
                            res.redirect('/');
                        }
                    }
                })
            }
        }
        else {
            req.flash('error', 'You must be logged in to do that');
            res.redirect('/');
        }
    }
}

module.exports = middleware;