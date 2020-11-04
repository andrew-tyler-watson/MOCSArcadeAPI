const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const gameSchema  = new Schema({

        gameInfo : {
            name : String,
            description : String,
            imageUrl : String,
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
        revisionHistory : {
            MinimumRequired : String,
            LatestStableRelease : String,
            TestRelease : String,
            Revisions : [Schema.Types.Mixed]
        },
        creationDate: Date,
        isApproved: {
            type: Boolean,
            default: false,
            required: true
        },
        userId : {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
})

module.exports = mongoose.model('Game', gameSchema, 'games');
