const express = require('express');
const cors = require('cors');
require('dotenv').config();
const helmet=require("helmet");
const rateLimit=require("express-rate-limit");

const { sequelize, connectDB } = require('./config/db.js');
const contactRoutes = require('./routes/contacts.js');
const telRoutes = require('./routes/telRoutes.js');
const evaluationRoutes = require('./routes/evaluations.js');
const authRoutes = require('./routes/auth.js');
const adminRoutes = require('./routes/admin.js');
const courseRoutes = require("./routes/course.js");


const app = express();
const PORT = process.env.PORT || 5000;
app.use(helmet());
app.use(rateLimit({ windowMs:15*60*1000, max:100 }));

// Middleware
app.use(cors({
  origin: function (origin, callback) {

    const allowedOrigins = [
      "https://sweksu.fyi",
      "http://localhost:5173"
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }

  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API Server is running with PostgreSQL');
});
app.use('/api/tel', telRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/courses", courseRoutes);

const startServer = async () => {
  await connectDB();
  

  await sequelize.sync({alter:true});
  console.log("تمت مزامنة جداول قاعدة البيانات بنجاح 🚀");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();