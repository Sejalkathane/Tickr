const express = require('express');
const router = express.Router();
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middleware/auth.middleware");

// Register route containing API endpoint for user registration and logic
router.post('/register',authController.registerUser)

router.post('/login',authController.loginUser)

router.post('/logout', authController.logoutUser)

router.get("/me", authMiddleware.authUser, authController.getMe);

router.put("/settings", authMiddleware.authUser, authController.updateSettings);

module.exports = router;