const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    sharedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    token: {
        type: String
    },
    status: {
        type: String,
        enum: ['own', 'pending', 'accepted', 'rejected'],
        default: 'pending'
    }
});

const Permission =  mongoose.model('Permission', permissionSchema);

module.exports = {
    permissionSchema,
    Permission
}