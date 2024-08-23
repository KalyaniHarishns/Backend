const express = require('express');
const multer = require('multer');
const path = require('path');
const Profile = require('../models/Profile');
const authenticateToken = require('../Middlewares/authenticateToken'); // Ensure correct file name
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Fetch profile (protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id }); // Find profile by user ID
    if (profile) {
      res.json({ profile });
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update profile (protected)
router.post('/create', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    const newProfile = new Profile({
      userId: req.user.id, // Associate profile with the authenticated user
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password, // Ensure this is hashed
      phoneNumber: req.body.phoneNumber,
      profileImage: req.file ? req.file.path : undefined
    });

    await newProfile.save();
    res.status(201).json({ profile: newProfile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile (protected)
router.put('/update', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    const updatedProfile = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password, // Ensure this is hashed
      phoneNumber: req.body.phoneNumber,
      profileImage: req.file ? req.file.path : req.body.profileImage
    };

    const profile = await Profile.findOneAndUpdate({ userId: req.user.id }, updatedProfile, { new: true });
    if (profile) {
      res.json({ profile });
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete profile (protected)
router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const result = await Profile.deleteOne({ userId: req.user.id });
    if (result.deletedCount > 0) {
      res.json({ message: 'Profile removed successfully' });
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
