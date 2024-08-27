const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import the User model
const router = express.Router();

// JWT secret key
const JWT_SECRET = 'mySuperSecretKey123!@#';

// Login route
router.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(req.body)
    const user = await User.findOne({ email }); // Use the User model to find the user by email


    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router;
