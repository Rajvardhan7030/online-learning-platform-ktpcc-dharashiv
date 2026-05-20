// backend/controllers/codeController.js
const Snippet = require('../model/snippet.js');
const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

//    Execute code via Piston API
//  POST /api/code/execute
//   Public
exports.executeCode = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const { language, code } = req.body;

    // Prioritize local Docker Piston API if running, fallback to public API
    const PISTON_URL = process.env.PISTON_URL || 'http://127.0.0.1:2000/api/v2/piston/execute';
    const PUBLIC_PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

    const executeWithTimeout = async (url) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        try {
            return await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: language,
                    version: "*", 
                    files: [{ content: code }]
                }),
                signal: controller.signal
            });
        } finally {
            clearTimeout(timeout);
        }
    };

    try {
        let response;
        try {
            // Attempt local Docker execution first
            response = await executeWithTimeout(PISTON_URL);
        } catch {
            console.warn('Local Piston API not reachable, falling back to public API...');
            // Fallback to public API
            response = await executeWithTimeout(PUBLIC_PISTON_URL);
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Piston API Error: ${response.status} - ${errorText}`);
            return next(new ErrorResponse('Execution server returned an error', response.status));
        }

        const data = await response.json();
        
        if (!data || !data.run) {
             return next(new ErrorResponse('Invalid response from execution server', 500));
        }

        if (data.compile && data.compile.code !== 0) {
            return res.status(200).json({ status: 'fail', output: data.compile.output });
        }

        res.status(200).json({ status: 'success', output: data.run.output });

    } catch (error) {
        if (error.name === 'AbortError') {
            return next(new ErrorResponse('Code execution timed out', 408));
        }
        return next(new ErrorResponse(`Execution error: ${error.message}`, 500));
    }
});

//    Save a code snippet to the database
//    POST /api/code/save
//   Private (Requires JWT)
exports.saveSnippet = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }

    const { title, language, code } = req.body;

    const snippet = await Snippet.create({
        user: req.user._id,
        title,
        language,
        code
    });
    
    res.status(201).json({ status: 'success', data: snippet });
});

//    Get all snippets for the logged-in user
//   GET /api/code/snippets
//  Private (Requires JWT)
exports.getSnippets = asyncHandler(async (req, res, _next) => {
    const snippets = await Snippet.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: snippets });
});
