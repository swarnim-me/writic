var router = require('express').Router({ mergeParams: true });
var User = require('../models/user');
var Post = require('../models/post');
var bcrypt = require('bcryptjs');
const passport = require('passport');
var middleware = require('../middleware');

router.get('/create', middleware.checkOwnership, function (req, res) {
    // console.log(req.params);
    res.render('create');
})

router.post('/create', middleware.checkOwnership, function (req, res) {
    var d = new Date();
    Post.create({
        title: req.body.title,
        body: req.body.body,
        author: req.user.username,
        dateCreated: "Created on " + d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear(),
    }, function (err, post) {
        if (err) {
            console.log(err);
            res.redirect('/');
        }
        else {
            User.findOne({ username: req.params.username }, function (err, user) {
                if (err) {
                    console.log(err);
                    res.redirect('back');
                }
                else {
                    user.posts.push(post);
                    user.save();
                    res.redirect('/');
                }
            })

        }
    })
})

router.get('/:id/delete', middleware.checkOwnership, function (req, res) {
    Post.findByIdAndDelete(req.params.id, function (err, post) {
        if (err) {
            console.log(err);
            res.redirect('back');
        }
        else {
            res.redirect('/' + req.user.username);
        }
    })
})

router.get('/:id', middleware.isLoggedIn, function (req, res) {
    User.findOne({ username: req.params.username }).populate('posts').exec(function (err, user) {
        if (err) {
            console.log(err);
            res.redirect('back');
        }
        else {
            if (user) {
                Post.findById(req.params.id, function (err, post) {
                    if (err) {
                        console.log(err);
                        req.flash('error', 'Post not found');
                        res.redirect('back');
                    }
                    else {
                        if (post) {
                            var found = false;
                            user.posts.some(function (post) {
                                if (post._id.equals(req.params.id)) {
                                    res.render('show', { post: post, user: user });
                                    found = true;
                                    return false;
                                }
                            })
                            if (found === false) {
                                req.flash('error', 'POST NOT FOUND');
                                res.redirect('back');
                            }
                        }
                        else {
                            console.log('POST NOT FOUND');
                            req.flash('error', 'No such post');
                            res.redirect('back');
                        }
                    }
                })
            }
            else {
                req.flash('error', 'User not found');
                res.redirect('back');
            }
        }
    })
})

router.get('/:id/save', middleware.isLoggedIn, function (req, res) {
    User.findOne({ username: req.params.username }, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect('back');
        }
        else {
            if (user) {
                Post.findById(req.params.id, function (err, post) {
                    if (err) {
                        console.log(err);
                        res.redirect('back');
                    }
                    else {
                        if (post) {
                            var foundInUsername = false;
                            var foundInUser = false;
                            user.posts.some(function (post) {
                                if (post._id.equals(req.params.id)) {
                                    foundInUsername = true;
                                    return false;
                                }
                            })
                            // console.log('Here');
                            // console.log('Here');
                            if (foundInUsername === true) {
                                req.user.liked.forEach(function (like) {
                                    console.log('here');
                                    if (like._id.equals(req.params.id)) {
                                        foundInUser = true;
                                    }
                                })
                                console.log(foundInUser);
                                if (foundInUser === true) {
                                    
                                    req.flash('error', 'This post is already saved');
                                    res.redirect('/');
                                }
                                else {
                                    req.user.liked.push(post);
                                    req.user.save();
                                    req.flash('success', 'Post saved successfully');
                                    res.redirect('back');
                                }
                            }
                            if (foundInUsername === false) {
                                req.flash('error', 'No such post');
                                res.redirect('back');
                            }
                        }
                        else {
                            req.flash('error', 'No such post');
                            res.redirect('back');
                        }
                    }
                })
            }
            else {
                req.flash('error', 'User not found');
                res.redirect('back');
            }
        }
    })
})

module.exports = router;