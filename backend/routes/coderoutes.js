// backend/routes/codeRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { executeCode, saveSnippet, getSnippets } = require('../controllers/codeController');
const { protect } = require('../middleware/authmiddleware.js');

const router = express.Router();

const executeValidation = [
    body('language').isString().notEmpty().withMessage('Language must be a valid string'),
    body('code').isString().notEmpty().withMessage('Code must be a valid string')
];

const saveValidation = [
    body('title').isString().notEmpty().withMessage('Title must be a valid string'),
    body('language').isString().notEmpty().withMessage('Language must be a valid string'),
    body('code').isString().notEmpty().withMessage('Code must be a valid string')
];

// Protected route for executing code
router.post('/execute', protect, executeValidation, executeCode);

// Protected routes (require user to be logged in)
router.post('/save', protect, saveValidation, saveSnippet);
router.get('/snippets', protect, getSnippets);

module.exports = router;