const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize, connectDB } = require('../config/db.js');

const telRoutes = require('../routes/telRoutes');
const evaluationRoutes = require("../routes/evaluations.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); 



// Routes
app.use('/api/tel', telRoutes);
app.get('/', (req, res) => {
  res.send('API Server is running');
});
app.use("/api/evaluations", evaluationRoutes);

connectDB().then(() => {
  // force: false تعني عدم مسح البيانات الموجودة مسبقاً، alter: true لتحديث الهيكل إذا تغير
  sequelize.sync({ alter: true }).then(() => {
    console.log("Database tables synced");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});