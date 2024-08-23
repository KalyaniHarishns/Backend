const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const LoginRoutes=require('./routes/LoginRoutes');
const authenticateToken = require('./Middlewares/authenticateToken');
const app = express();
const profileRoutes = require('./routes/ProfileRoutes');
const authroutes=require('./routes/authroutes')
const port = process.env.PORT || 3001;
const mongoose=require('mongoose');
// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000' // Replace with your frontend URL
}));
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/demo';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
app.use(bodyParser.json());

// In-memory user store (replace with a database in production)
const users = [];

// JWT secret key (should be in an environment variable)
const JWT_SECRET = 'mySuperSecretKey123!@#';

// Sign Up endpoint
app.post('/api/auth/signup', (req, res) => {
  const { email, password } = req.body;

  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  users.push({ email, password: hashedPassword });
  res.status(201).json({ message: 'User created' });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = users.find(u => u.email === email);

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Protected Profile endpoint
app.get('/api/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ email: decoded.email });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});
app.use('/api/user/forgot-password', authroutes); // Password reset routes

// Protected routes
app.use('/api/user/profile', authenticateToken, profileRoutes); // Apply middleware to profile routes

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
