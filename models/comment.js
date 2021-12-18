const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    // New format value
    comment: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    creationDate: Date,
    gameId: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    }
})


module.exports = mongoose.model('Comment', commentSchema, 'comment');
