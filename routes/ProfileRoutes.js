const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const Profile = require('../models/Profile');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get Profile by ID Route
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create Profile Route
router.post('/', upload.single('profileImage'), async (req, res) => {
  try {
    const profileData = {
      ...req.body,
      profileImage: req.file ? req.file.path : null,
    };
    const newProfile = new Profile(profileData);
    await newProfile.save();
    res.status(201).json({
      message: 'Profile created successfully',
      profile: newProfile,
    });
  } catch (err) {
    console.error('Error creating profile:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update Profile Route
router.put('/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const profileData = {
      ...req.body,
      profileImage: req.file ? req.file.path : null,
    };

    if (profileData.password) {
      profileData.password = await bcrypt.hash(profileData.password, 10);
    }

    const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, profileData, { new: true });
    if (!updatedProfile) return res.status(404).json({ message: 'Profile not found' });

    res.json({
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete Profile Route
router.delete('/:id', async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting profile:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
