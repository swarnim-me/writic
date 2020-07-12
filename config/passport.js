var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcryptjs');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'username', passwordField: 'password'}, function(username, password, done){
        User.findOne({username : username}, function(err, user){
            if(err){
                console.log(err);
                res.redirect('back');
            }
            else{
                if(user){
                    bcrypt.compare(password, user.password, function(err, isMatch){
                        if(isMatch){
                            return done(null, user);
                        }
                        else{
                            return done(null, false);
                        }
                    })
                }
                else{
                    return done(null, false);
                }
            }
        })
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}