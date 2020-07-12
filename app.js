var express = require('express');
var app = express();
var mongoose = require('mongoose');
var user = require('./routes/user');
var auth = require('./routes/auth');
var post = require('./routes/post');
var flash = require('connect-flash');
var passport = require('passport');
require('./config/passport')(passport);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/writic");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.use(require("express-session")({
    secret: "It will be used to encode and decode sessions",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function (req, res, next) {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.currentUser = req.user;
    next();
})


app.use('/auth', auth);
app.use('/', user);
app.use('/:username', post);
app.get('/', function (req, res) {
    res.render('landing');
})

app.listen(3000, function () {
    console.log('SERVER STARTED!');
})

