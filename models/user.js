var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    username: String,
    gender: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    liked : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    show : String

})

module.exports = mongoose.model('User', userSchema);