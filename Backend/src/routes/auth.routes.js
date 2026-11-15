const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller")

// Register route containing API endpoint for user registration and logic
router.post('/register',authController.registerUser)

router.post('/login',authController.loginUser)

router.post('/logout', authController.logoutUser)

module.exports = router;