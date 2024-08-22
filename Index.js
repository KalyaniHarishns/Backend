const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const profileRoutes = require('./routes/ProfileRoutes');
const authRoutes = require('./routes/authroutes');
//const authenticateToken = require('./Middlewares/Auth');




const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/profile-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Log all requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Public routes
app.use('/api/user/forgot-password', authRoutes); // Password reset routes

// Protected routes
//app.use('/api/user/profile', authenticateToken, profileRoutes); // Apply middleware to profile routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
