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
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Routes
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/profiledb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('uploads')); // Serve static files (profile images)

// Use routes
app.use('/api/user/profile', profileRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
