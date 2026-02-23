// backend/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authcontroller.js');

const router = express.Router();

// POST /api/auth/register will trigger the registerUser function
router.post('/register', registerUser);

// POST /api/auth/login will trigger the loginUser function
router.post('/login', loginUser);

module.exports = router;