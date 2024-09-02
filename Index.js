const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 
// const Profile = require('./models/Profile'); 
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


app1.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      // Assuming `user` has a property `_id`
      res.status(200).json({ message: 'Login successful', data: { _id: user._id } });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});



app1.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Server error fetching user details', error: err.message });
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


app1.put('/api/users/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.params.id;

   
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

   
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (req.file) {
      user.profileImage = req.file.path; 
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error during update', error: err.message });
  }
});


// Delete user profile
app1.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error during delete', error: err.message });
  }
});

app1.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
