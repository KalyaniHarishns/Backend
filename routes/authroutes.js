const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 6 characters, include an uppercase letter, a lowercase letter, and a special character.' });
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


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

module.exports = router;
