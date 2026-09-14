const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, connectDB } = require('./config/db.js');
const contactRoutes = require('./routes/contacts.js');
const telRoutes = require('./routes/telRoutes.js');
const evaluationRoutes = require('./routes/evaluations.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API Server is running with PostgreSQL');
});
app.use('/api/tel', telRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/contacts', contactRoutes);

// بدء تشغيل الخادم ومزامنة قاعدة البيانات
const startServer = async () => {
  await connectDB();
  
  // إنشاء الجداول في Neon إن لم تكن موجودة وتحديثها
  await sequelize.sync();
  console.log("تمت مزامنة جداول قاعدة البيانات بنجاح 🚀");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();