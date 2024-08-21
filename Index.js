const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const profileRoutes = require('./routes/ProfileRoutes');
const authRoutes = require('./routes/authroutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

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

// Routes
app.use('/api/user/profile', profileRoutes);
app.use('/api/user/forgot-password', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
