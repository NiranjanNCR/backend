const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({ 
  origin: 'https://counselling-fd.vercel.app', // Frontend URL
  credentials: true 
}));
app.use(bodyParser.json()); // For parsing JSON data
app.use(bodyParser.urlencoded({ extended: true })); // For parsing URL-encoded data

// MongoDB setup
mongoose.connect(
  process.env.MONGO_URI || 'mongodb+srv://nrjsingh5123:SngVAHCGa4bnjfbZ@counselling.3rc96.mongodb.net/counselling', 
  { useNewUrlParser: true, useUnifiedTopology: true, retryWrites: true }
);
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// Schema and Model for form data
const formSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  number: Number,
  message: String,
});
const Form = mongoose.model('Form', formSchema);

// API route for form submission
app.post('/submit', async (req, res) => {
  const { firstName, lastName, email, number, message } = req.body;

  // Validate required fields
  if (!firstName || !email) {
    return res.status(400).send('Missing required fields.');
  }

  // Create new form data instance
  const formData = new Form({
    firstName,
    lastName,
    email,
    number,
    message,
  });

  try {
    // Save form data to the database
    await formData.save();
    res.status(200).send('Form data saved successfully!');
  } catch (error) {
    console.error('Error saving form data:', error.message);
    res.status(500).send('Failed to save form data.');
  }
});

// Export the express app for Vercel
module.exports = app;
