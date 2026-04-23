const { validationResult } = require('express-validator');
const ForumThread = require('../model/forumThread');

const formatThread = (thread) => ({
    id: thread._id,
    title: thread.title,
    body: thread.body,
    tags: thread.tags,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
    author: thread.author ? {
        id: thread.author._id,
        username: thread.author.username,
        email: thread.author.email
    } : null,
    answers: (thread.answers || []).map((answer) => ({
        id: answer._id,
        body: answer.body,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
        author: answer.author ? {
            id: answer.author._id,
            username: answer.author.username,
            email: answer.author.email
        } : null
    }))
});

exports.getThreads = async (req, res) => {
    try {
        const threads = await ForumThread.find()
            .populate('author', 'username email')
            .populate('answers.author', 'username email')
            .sort({ updatedAt: -1 });

        res.status(200).json({
            status: 'success',
            data: threads.map(formatThread)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createThread = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const tags = Array.isArray(req.body.tags)
            ? req.body.tags
            : String(req.body.tags || '')
                .split(',')
                .map((tag) => tag.trim().toLowerCase())
                .filter(Boolean)
                .slice(0, 5);

        const thread = await ForumThread.create({
            author: req.user._id,
            title: req.body.title.trim(),
            body: req.body.body.trim(),
            tags
        });

        const populatedThread = await ForumThread.findById(thread._id)
            .populate('author', 'username email')
            .populate('answers.author', 'username email');

        res.status(201).json({
            status: 'success',
            data: formatThread(populatedThread)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.addAnswer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const thread = await ForumThread.findById(req.params.threadId);

        if (!thread) {
            return res.status(404).json({ message: 'Discussion thread not found' });
        }

        thread.answers.push({
            author: req.user._id,
            body: req.body.body.trim()
        });

        await thread.save();

        const populatedThread = await ForumThread.findById(thread._id)
            .populate('author', 'username email')
            .populate('answers.author', 'username email');

        res.status(201).json({
            status: 'success',
            data: formatThread(populatedThread)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
