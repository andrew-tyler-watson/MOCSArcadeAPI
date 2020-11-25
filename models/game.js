const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    // New format value
    gameInfo: {
        name: String,
        description: String,
        /*icon:
        {
            data: Buffer, 
            contentType: String 
        },*/
        gameplayPreview:
        {
            data: Buffer, 
            contentType: String 
        },
        imageUrl: String
    },
    revisionHistory : {
        revisions : [Schema.Types.Mixed]
    },
    creationDate: Date,
    isApproved: {
        type: Boolean,
        default: false,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})


module.exports = mongoose.model('Game', gameSchema, 'games');
