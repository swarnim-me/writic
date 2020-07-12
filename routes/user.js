var router = require('express').Router({ mergeParams: true });
var User = require('../models/user');
var bcrypt = require('bcryptjs');
const passport = require('passport');
var middleware = require('../middleware');

router.get('/:username', middleware.isPublic, function (req, res) {
    User.findOne({ username: req.params.username }).populate('posts').exec(function (err, user) {
        if (err) {
            console.log(err);
            res.redirect('back');
        }
        else {
            // console.log(user);
            if (user) {
                res.render('home', { posts: user.posts, user: user });
            }
            else {
                req.flash('error', 'User not found');
                res.redirect('back');
            }
        }
    })
})

router.get('/user/search', function (req, res) {
    User.findOne({ username: req.query.searchUser }, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect('back');
        }
        else {
            res.redirect('/' + req.query.searchUser);
        }
    })
})

router.get('/:username/settings', middleware.checkOwnership, function (req, res) {
    res.render('settings');
})
router.post('/:username/settings', middleware.checkOwnership, function (req, res) {
    if (req.body.username !== req.user.username) {
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect('back');
            }
            else {
                if (user) {
                    req.flash('error', 'Username should be unique');
                    res.redirect('back');
                }
                else {
                    var updatedUser = {
                        username: req.body.username,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        show: req.body.privacy
                    }
                    User.findOneAndUpdate({ username: req.params.username }, updatedUser, function (err, finalUser) {
                        if (err) {
                            console.log(err);
                            res.redirect('back');
                        }
                        else {
                            req.flash('success', 'You profile is updated!');
                            res.redirect('/');
                        }
                    })
                }
            }
        })
    }
    else {
        var updatedUser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            show: req.body.privacy
        }
        User.findOneAndUpdate({ username: req.params.username }, updatedUser, function (err, finalUser) {
            if (err) {
                console.log(err);
                res.redirect('back');
            }
            else {
                req.flash('success', 'You profile is updated!');
                res.redirect('/');
            }
        })
    }

})

router.get('/:username/saved', middleware.checkOwnership, function (req, res) {
    User.findOne({ username: req.params.username }).populate('liked').exec(function (err, user) {
        if (err) {
            console.log(err);
            res.redirect('back');
        }
        else {
            console.log(user.liked);
            res.render('saved', { liked: user.liked });
        }
    })
})
//<%=currentUser.username%>/saved/<%=like._id%>/delete
router.get('/:username/saved/:id/delete', middleware.checkOwnership, function(req, res){
    User.findOne({username : req.params.username}, function(err, user){
        if(err){
            console.log(err);
            res.redirect('back');
        }
        else{
            if(user){
                var found = false;
                user.liked.forEach(function(like, index){
                    if(like.equals(req.params.id)){
                        found = true;
                        user.liked.splice(index, 1);
                        user.save();
                    }
                })
                if(found === false){
                    req.flash('error', 'Post not found');
                    res.redirect('back');
                }
                else{
                    req.flash('success', 'Post deleted successfully');
                    res.redirect('back');
                }
            }
        }
    })
})


module.exports = router;
