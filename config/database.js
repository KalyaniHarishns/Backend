// config/database.js
const mongoose = require('mongoose');

// MongoDB URI (replace with your MongoDB connection string if needed)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/demo';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
