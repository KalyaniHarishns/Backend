const express = require('express');
const multer = require('multer');
const path = require('path');
const Profile = require('../models/Profile');
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

// Fetch profile data
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (profile) {
      res.json({ profile });
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new profile
router.post('/create', upload.single('profileImage'), async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const newProfile = new Profile({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      profileImage: req.file ? req.file.path : undefined
    });

    await newProfile.save();
    res.status(201).json({ profile: newProfile });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update or create profile
router.put('/update', upload.single('profileImage'), async (req, res) => {
  try {
    const updatedProfile = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password, // Ensure this is hashed before storing in a real application
      phoneNumber: req.body.phoneNumber,
      profileImage: req.file ? req.file.path : req.body.profileImage
    };

    const profile = await Profile.findOneAndUpdate({}, updatedProfile, { new: true, upsert: true });
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete profile
router.delete('/delete', async (req, res) => {
  try {
    await Profile.deleteOne({});
    res.json({ message: 'Profile removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
