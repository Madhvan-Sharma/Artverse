const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
    location: {
        type: String
    },
    user: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    privacy:{
        type: Boolean
    },
    title:{
        type: String
    },
    public_id:{
        type: String
    },
    // include the array of ids of all comments in this post schema itself
    comments: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, {
    timestamps: true
});


const Image = mongoose.model('Image', imageSchema);

module.exports = Image;