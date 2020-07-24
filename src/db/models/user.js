
const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        default: function () {
            return this.email.split('@')[0];
        }
    },
    hash: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    followers: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                unique: true
            }
        }
    ],
    following: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                unique: true
            }
        }
    ]
});

UserSchema.methods.isFollowing = function(user) {
    const index = this.following.findIndex( obj => obj.userId.toString() ===  user._id.toString());
    return index >= 0 ? index : false;
}

UserSchema.methods.isFollowedBy = function(user) {
    const index = this.followers.findIndex( obj => obj.userId.toString() ===  user._id.toString());
    return index >= 0 ? index : false;
} 

const User = model('User', UserSchema);


module.exports = User;
