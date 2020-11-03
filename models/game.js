const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const gameSchema  = new Schema({

        GameInfo : {
            Name : String,
            Description : String,
            ImageUrl : String,
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
        Author : {
            AuthorName : String,
            Bio : String,
            ImageUrl : String,
            UserID : {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        },
        RevisionHistory : {
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
})

module.exports = mongoose.model('Game', gameSchema, 'games');
