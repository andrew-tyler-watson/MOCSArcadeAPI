const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    // Old format value
    name: String,
    // New format value
    gameInfo: {
        name: String,
        description: String,
        icon:
        {
            data: Buffer, 
            contentType: String 
        },
        gameplayPreview:
        {
            data: Buffer, 
            contentType: String 
        }
    },
    fileId: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creationDate: Date,
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
        default: true
    },
    isOldFormat: {
        type: Boolean,
        default: false
    },
    versions: [
        {
            name: String,
            isGoogleDriveDownload: {
                type: Boolean,
                default: false
            },
            FileId: String,

            isHttpDownload: {
                type: Boolean,
                default: false
            },
            FileId: String,

            releaseNotes: String,
            isActive: Boolean
        }
    ]
})


module.exports = mongoose.model('Game', gameSchema, 'games');
