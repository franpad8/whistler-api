const { Schema, model } = require('mongoose');

const WhistleSchema = new Schema({
    text: {
        type: String
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date
    },
    updatedAt: {
        type: Date,
        default: Date
    }
});

WhistleSchema.statics.makeId = function (t) {
    return new Schema.Types.ObjectId(t);
};

module.exports = model('Whistle', WhistleSchema);
