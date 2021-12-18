const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    // New format value
    rating: Number,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    gameId: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    }
})


module.exports = mongoose.model('Rating', ratingSchema, 'rating');
