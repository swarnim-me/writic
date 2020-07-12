var mongoose = require('mongoose');
const { post } = require('../routes/auth');

var postSchema = new mongoose.Schema({
    title : String,
    body : String,
    author : String,
    likes : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    dateCreated : String,
})

module.exports = mongoose.model('Post', postSchema);