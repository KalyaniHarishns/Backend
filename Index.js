const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 
const Profile = require('./models/Profile'); 
const app1 = express();
const multer = require('multer');
const path = require('path');
const port = process.env.PORT || 3001;

app1.use(express.json());
app1.use(cors({
  origin: 'http://localhost:3000' 
}));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/demo';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app1.use(bodyParser.json());

// Sign Up endpoint
app1.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password should have a minimum of 6 characters.' });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ message: 'Password should have at least one uppercase letter.' });
  }
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({ message: 'Password should have at least one lowercase letter.' });
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(400).json({ message: 'Password should have at least one special character.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
});

// Login endpoint
app1.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

// Get User Profile
app1.get('/api/profile', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app1.post('/api/profile', upload.single('profileImage'), async (req, res) => {
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

// Update Profile
app1.put('/api/profile/:id', upload.single('profileImage'), async (req, res) => {
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

app1.delete('/api/profile/:id', async (req, res) => {
  try {
    await Profile.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete User Profile
app1.delete('/api/profile/:id', async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting profile:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app1.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
