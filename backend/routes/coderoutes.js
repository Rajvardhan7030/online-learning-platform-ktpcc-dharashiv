// backend/routes/codeRoutes.js
const express = require('express');
const { executeCode, saveSnippet, getSnippets } = require('../controllers/codeController');
const { protect } = require('../middleware/authmiddleware.js');

const router = express.Router();

// Public route for executing code
router.post('/execute', executeCode);

// Protected routes (require user to be logged in)
router.post('/save', protect, saveSnippet);
router.get('/snippets', protect, getSnippets);

module.exports = router;