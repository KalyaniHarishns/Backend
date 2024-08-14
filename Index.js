// // index.js
// const express = require('express');
// const mongoose = require('mongoose');
// const db = require('./db'); // Ensure you have a db.js file for DB connection
// require('dotenv').config();

// const UserRoutes = require('./routes/UserRoutes'); // Correct path to routes file
// const app = express();

// app.use(express.json());

// // Connect to MongoDB
// db(); // This should properly connect to MongoDB

// // Use routes
// app.use('/api/user', UserRoutes); // Prefix routes with /api/user

// const port = process.env.PORT || 5000;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require('./routes/authRoutes');

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

// Routes
app.use('/api/user/profile', profileRoutes);
app.use('/api/user/forgot-password', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
