const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = process.env.DB_STORAGE_PATH || path.join(__dirname, '../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // لمنع طباعة أوامر SQL في التيرمنال
});


const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("SQLite database connected");
  } catch (err) {
    console.error("DB connection failed :", err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
