const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/counselling', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Schema and Model
const formSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  number: Number,
  message: String,
  file: String, // File path
});

const Form = mongoose.model('Form', formSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// API route for form submission
app.post('/submit', upload.single('file'), async (req, res) => {
  const { firstName, lastName, email, number, message } = req.body;

  const formData = new Form({
    firstName,
    lastName,
    email,
    number,
    message,
  });

  try {
    await formData.save();
    res.status(200).send('Form data saved successfully!');
  } catch (error) {
    res.status(500).send('Failed to save form data.');
    console.error('Error:', error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
