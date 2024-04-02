const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Load environment variables if you're using them
require('dotenv').config();

// MongoDB Atlas credentials from environment variables
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// Connect to MongoDB Atlas
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.fly8mqy.mongodb.net/feedback`)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Define Review schema
const reviewSchema = new mongoose.Schema({
    email: String,
    username: String,
    feedback: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create Review model
const Review = mongoose.model('Review', reviewSchema);

// Set EJS as view engine
app.set('view engine', 'ejs');

// Define routes
app.get('/', async (req, res, next) => {
  try {
    // Fetch all reviews from MongoDB
    const reviews = await Review.find();
    console.log(reviews); // For debugging
    res.render('index', { reviews });
  } catch (err) {
    // Pass error to error handling middleware
    next(err);
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal Server Error');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
