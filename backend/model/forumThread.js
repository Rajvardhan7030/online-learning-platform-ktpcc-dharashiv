const mongoose = require('mongoose');

const forumAnswerSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    }
}, { timestamps: true });

const forumThreadSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120
    },
    body: {
        type: String,
        required: true,
        trim: true,
        maxlength: 4000
    },
    tags: {
        type: [String],
        default: []
    },
    answers: {
        type: [forumAnswerSchema],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('ForumThread', forumThreadSchema);
