// backend/controllers/codeController.js
const Snippet = require('../model/snippet.js');

// @desc    Execute code via Piston API
// @route   POST /api/code/execute
// @access  Public (or you can make it Private by adding 'protect' middleware later)
exports.executeCode = async (req, res) => {
    const { language, code } = req.body;

    if (!language || !code) {
        return res.status(400).json({ message: 'Language and code are required' });
    }

    try {
        // We use the native fetch API (available in Node 18+) to call Piston
        // Piston v2 requires language, a version (we use "*" for the latest available), and the files.
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: language,
                version: "*", 
                files: [{ content: code }]
            })
        });

        const data = await response.json();

        // Check if Piston returned a compilation/execution error
        if (data.compile && data.compile.code !== 0) {
            return res.status(400).json({ output: data.compile.output });
        }

        // Return the successful standard output/error from Piston
        res.status(200).json({ output: data.run.output });

    } catch (error) {
        console.error("Execution error:", error);
        res.status(500).json({ message: 'Error executing code', error: error.message });
    }
};

// @desc    Save a code snippet to the database
// @route   POST /api/code/save
// @access  Private (Requires JWT)
exports.saveSnippet = async (req, res) => {
    const { title, language, code } = req.body;

    try {
        const snippet = await Snippet.create({
            user: req.user._id, // Got this from the protect middleware
            title,
            language,
            code
        });
        res.status(201).json(snippet);
    } catch (error) {
        res.status(500).json({ message: 'Error saving snippet', error: error.message });
    }
};

// @desc    Get all snippets for the logged-in user
// @route   GET /api/code/snippets
// @access  Private (Requires JWT)
exports.getSnippets = async (req, res) => {
    try {
        // Find all snippets belonging to the currently authenticated user
        const snippets = await Snippet.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(snippets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching snippets', error: error.message });
    }
};