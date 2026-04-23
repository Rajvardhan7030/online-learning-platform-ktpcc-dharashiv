const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authmiddleware');
const { getThreads, createThread, addAnswer } = require('../controllers/forumController');

const router = express.Router();

const threadValidation = [
    body('title')
        .trim()
        .isLength({ min: 5, max: 120 })
        .withMessage('Thread title must be between 5 and 120 characters'),
    body('body')
        .trim()
        .isLength({ min: 10, max: 4000 })
        .withMessage('Question details must be between 10 and 4000 characters')
];

const answerValidation = [
    body('body')
        .trim()
        .isLength({ min: 2, max: 2000 })
        .withMessage('Answer must be between 2 and 2000 characters')
];

router.get('/threads', getThreads);
router.post('/threads', protect, threadValidation, createThread);
router.post('/threads/:threadId/answers', protect, answerValidation, addAnswer);

module.exports = router;
