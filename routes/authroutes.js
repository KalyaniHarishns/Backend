
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body;
 
  res.json({ message: 'Password reset instructions have been sent to your email.' });
});

module.exports = router;
