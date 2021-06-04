const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const previewSchema = new Schema({
    type: String,
    driveId: String,
    youtubeId: String,
})

const gameSchema = new Schema({
    // New format value
    gameInfo: {
        name: String,
        description: String,
        title: String
    },
    gameplayPreviews: [previewSchema],
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
    },
    keybinds: {
        P1up: {
            type: String,
            default: "Up"
        },
        P1down: {
            type: String,
            default: "Down"
        },
        P1left: {
            type: String,
            default: "Left"
        },
        P1right: {
            type: String,
            default: "Right"
        },
        P1A: {
            type: String,
            default: "j"
        },
        P1B: {
            type: String,
            default: "k"
        },
        P1X: {
            type: String,
            default: "i"
        },
        P1Y: {
            type: String,
            default: "o"
        },
        P1Z: {
            type: String,
            default: "p"
        },
        P2up: {
            type: String,
            default: "w"
        },
        P2down: {
            type: String,
            default: "s"
        },
        P2left: {
            type: String,
            default: "a"
        },
        P2right: {
            type: String,
            default: "d"
        },
        P2A: {
            type: String,
            default: "f"
        },
        P2B: {
            type: String,
            default: "g"
        },
        P2X: {
            type: String,
            default: "t"
        },
        P2Y: {
            type: String,
            default: "y"
        },
        P2Z: {
            type: String,
            default: "h"
        },
        Start: {
            type: String,
            default: "Enter"
        },
        Exit: {
            type: String,
            default: "Escape"
        }
    }
})


module.exports = mongoose.model('Game', gameSchema, 'games');
