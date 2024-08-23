const jwt = require('jsonwebtoken');
const JWT_SECRET = 'mySuperSecretKey123!@#'; // Ensure this matches the secret used for signing

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token

  if (token == null) return res.sendStatus(401); // No token found

  jwt.verify(token, JWT_SECRET, (err, user) => { // Use JWT_SECRET here
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next(); // Proceed to next middleware/handler
  });
};

module.exports = authenticateToken;
