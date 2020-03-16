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
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    shouldUpdate: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Game', gameSchema);
