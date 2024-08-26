const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import the User model
const bcrypt = require('bcryptjs');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000' 
}));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/demo';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());

// Sign Up endpoint
app.post('/api/auth/signup', async (req, res) => {
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
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
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

// Protected Profile endpoint (requires token-based authentication, if JWT was used)
app.get('/api/profile', (req, res) => {
  // This endpoint would require a token-based authentication (e.g., JWT) to be properly protected
  // Example implementation without JWT authentication is commented out.
  res.json({ message: 'Profile data would be here' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
