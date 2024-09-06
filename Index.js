const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('./models/User'); 
const path = require("path");

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());
mongoose.connect('mongodb://localhost:27017/demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});
const upload = multer({ storage: storage });



app.post("/studylogins", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({
        message: 'Login successful',
        userId: user._id,
        username: user.name,
        email: user.email 
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});





app.post("/studysignups", async (req, res) => 
  {
  const { name, email, password } = req.body;
  const imagePath=null;
console.log(email);
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
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
    const sp = await User.create({ name, email, password ,imagePath});
    res.status(201).json(sp);
  } catch (err) {
    console.error('Error creating signup:', err); 
    res.status(400).json({ message: 'Error creating signup', error: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      console.log(user)
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Server error fetching user details', error: err.message });
  }
});

app.post('/api/profile', upload.single('profileImage'), async (req, res) => {
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

app.put('/api/users/:id', upload.single('profileImage'), async (req, res) => {
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
      // Format path to use forward slashes
      user.profileImage = req.file.path.replace(/\\/g, '/'); 
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error during update', error: err.message });
  }
});



app.delete('/api/users/:id', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
