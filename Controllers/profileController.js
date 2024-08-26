const fs = require('fs');
const path = require('path');

// Path to the profile data file
const profileFilePath = path.join(__dirname, '../data/profile.json');

// Read profile data
const readProfileData = () => {
  if (fs.existsSync(profileFilePath)) {
    return JSON.parse(fs.readFileSync(profileFilePath, 'utf8'));
  }
  return {};
};

// Write profile data
const writeProfileData = (data) => {
  fs.writeFileSync(profileFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Controller functions
const getProfile = (req, res) => {
  const profileData = readProfileData();
  res.json({ profile: profileData });
};

const updateProfile = (req, res) => {
  const updatedProfile = req.body;
  writeProfileData(updatedProfile);
  res.json({ message: 'Profile updated successfully' });
};

const createProfile = (req, res) => {
  const newProfile = req.body;
  writeProfileData(newProfile);
  res.json({ message: 'Profile created successfully' });
};

const deleteProfile = (req, res) => {
  fs.unlinkSync(profileFilePath);
  res.json({ message: 'Profile removed successfully' });
};

module.exports = {
  getProfile,
  updateProfile,
  createProfile,
  deleteProfile
};
