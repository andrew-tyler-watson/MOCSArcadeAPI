const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    fileId: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    shouldUpdate: {
        type: Boolean,
        default: false,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    }
})


module.exports = mongoose.model('Game', gameSchema);
