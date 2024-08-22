const Profile = require('../models/Profile');
const fs = require('fs');

// Middleware for file upload handling
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create a new profile
exports.createProfile = [
  upload.single('profileImage'),
  async (req, res) => {
    try {
      const { firstName, lastName, email, password, phoneNumber } = req.body;
      const profileImage = req.file ? req.file.path : '';

      const newProfile = new Profile({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        profileImage
      });

      await newProfile.save();
      res.json({ success: true, message: 'Profile created successfully' });
    } catch (error) {
      console.error('Error creating profile:', error);
      res.status(500).json({ success: false, message: 'Error creating profile' });
    }
  }
];

// Update an existing profile
exports.updateProfile = [
  upload.single('profileImage'),
  async (req, res) => {
    try {
      const { firstName, lastName, email, password, phoneNumber, _id } = req.body;
      const profileImage = req.file ? req.file.path : '';

      const updatedProfile = await Profile.findByIdAndUpdate(
        _id,
        {
          firstName,
          lastName,
          email,
          password,
          phoneNumber,
          profileImage
        },
        { new: true }
      );

      if (!updatedProfile) {
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      res.json({ success: true, message: 'Profile updated successfully', profile: updatedProfile });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ success: false, message: 'Error updating profile' });
    }
  }
];

// Delete a profile
exports.removeProfile = async (req, res) => {
  try {
    const { _id } = req.body;

    const profile = await Profile.findById(_id);
    if (profile && profile.profileImage) {
      fs.unlinkSync(profile.profileImage); // Delete the image file
    }
     await Profile.findByIdAndDelete(_id);
    res.json({ success: true, message: 'Profile removed successfully' });
  } catch (error) {
    console.error('Error removing profile:', error);
    res.status(500).json({ success: false, message: 'Error removing profile' });
  }
};

// Forgot password handler
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  // Implement your logic for sending a password reset email
  res.json({ success: true, message: 'Password reset instructions have been sent to your email.' });
};
