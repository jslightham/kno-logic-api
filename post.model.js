const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Database schema for an email message
let Post = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    author: {
        type: String
    },
    category: {
        type: Array
    },
    link: {
        type: String
    }, 
    date: {
        type: Date
    },
    photo: {
        type: String
    }
}, {
    collection: 'posts'
});

module.exports = mongoose.model('Post', Post);