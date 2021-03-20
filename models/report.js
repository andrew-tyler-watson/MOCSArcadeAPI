const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const reportSchema = new Schema({
    gameId: {
        type: Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    version: {
        type: String,
        required: true
    },
    reportType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Report', reportSchema, 'reports');