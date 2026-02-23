// backend/models/Snippet.js
const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Links this snippet to a specific User
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled Snippet'
    },
    language: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Snippet', snippetSchema);