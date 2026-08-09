const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('../config/db');

const telRoutes = require('../routes/telRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); 

connectDB();

// Routes
app.use('/api/tel', telRoutes);
app.get('/', (req, res) => {
  res.send('API Server is running');
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});