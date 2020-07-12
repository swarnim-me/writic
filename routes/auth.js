var router = require('express').Router();
var User = require('../models/user');
var bcrypt = require('bcryptjs');
const passport = require('passport');
var middleware = require('../middleware');

router.get('/login', function (req, res) {
    res.render('login');
})

router.get('/register', function (req, res) {
    res.render('register');
})



router.post('/register', function (req, res) {
    if (req.body.terms) {
        if (req.body.password === req.body.confpassword) {
            User.findOne({ email: req.body.email }, function (err, user) {
                if (err) {
                    console.log(err);
                }
                else {
                    if (user) {
                        req.flash('error', 'A user with the same email address already exists');
                    }
                    else {
                        User.findOne({ username: req.body.username }, function (err, foundUser) {
                            if (err) {
                                console.log(err);
                                res.redirect('back');
                            }
                            else {
                                if (foundUser) {
                                    req.flash('error', 'Username should be unique');
                                    res.redirect('back');
                                }
                                else {
                                    var newUser = new User({
                                        firstname: req.body.firstname,
                                        lastname: req.body.lastname,
                                        email: req.body.email,
                                        password: req.body.password,
                                        username: req.body.username,
                                        gender: req.body.gender,
                                        show: req.body.privacy
                                    });
                                    bcrypt.genSalt(10, function (err, salt) {
                                        if (err) {
                                            console.log(err);
                                            res.redirect('back');
                                        }
                                        else {
                                            bcrypt.hash(req.body.password, salt, function (err, hashedPassword) {
                                                if (err) {
                                                    console.log(err);
                                                    res.redirect('back');
                                                }
                                                else {
                                                    newUser.password = hashedPassword;
                                                    newUser.save(function (err, createdUser) {
                                                        if (err) {
                                                            console.log(err);
                                                            res.redirect('back');
                                                        }
                                                        else {
                                                            req.flash('success', 'Registration successful');
                                                            res.redirect('/auth/login');
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }
        else {
            // res.send("PASSWORD DON'T MATCH!");
            req.flash('error', "Passwords don't match");
            res.redirect('back');
        }
    }
    else {
        req.flash('error', "Please accept the terms and conditions");
        res.redirect('back');
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
    })(req, res, next);
});

router.get('/logout', middleware.isLoggedIn, function (req, res) {
    req.logout();
    req.flash('success', 'You have been logged out');
    res.redirect('/');
});


module.exports = router;
