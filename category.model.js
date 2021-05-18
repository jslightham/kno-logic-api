const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Database schema for an email message
let Category = new Schema({
    name: {
        type: String
    },
    color: {
        type: String
    },
}, {
    collection: 'categories'
});

module.exports = mongoose.model('Category', Category);