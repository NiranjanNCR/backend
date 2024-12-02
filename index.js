const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Use express's built-in JSON parser (no need for body-parser)
// Middleware
app.use(cors({ 
  origin: 'https://counselling-fd.vercel.app', // Frontend URL
  credentials: true 
}));

// MongoDB setup
mongoose.connect('mongodb+srv://niranjansinghwrk:JM01rxmHKxUNyYKL@cluster0.overd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
// mongoose.connect('mongodb://localhost:27017/counselling')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema and Model
const formSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: Number, required: true },
  message: { type: String, required: true },
});

const Form = mongoose.model('Form', formSchema);

// API route for form submission
app.post('/submit', async (req, res) => {
  try {
    const { firstName, lastName, email, number, message } = req.body;

    const formData = new Form({ firstName, lastName, email, number, message });
    await formData.save();

    res.status(200).json({ message: 'Form data saved successfully!' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ message: 'Failed to save form data.', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
