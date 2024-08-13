const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Create a new profile
router.post('/create', profileController.createProfile);

// Update an existing profile
router.put('/', profileController.updateProfile);

// Delete a profile
router.delete('/', profileController.removeProfile);

// Forgot password
router.post('/forgot-password', profileController.forgotPassword);

module.exports = router;
