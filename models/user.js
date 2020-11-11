const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    bio: String,
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isAuthorized: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema, 'users');