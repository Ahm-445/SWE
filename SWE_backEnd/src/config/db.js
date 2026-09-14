const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { Sequelize } = require('sequelize');
const pg = require('pg');

if (!process.env.DATABASE_URL) {
  console.error("خطأ: لم يتم العثور على DATABASE_URL في .env");
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 20000 // مهلة 20 ثانية لتفادي التعليق في حال بطء الشبكة
  },
  logging: console.log, // تفعيل السجلات لمعرفة ما إذا كانت الأوامر تُرسل لقاعدة البيانات
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    console.log("جارٍ محاولة الاتصال بقاعدة بيانات Neon...");
    await sequelize.authenticate();
    console.log("تم الاتصال بقاعدة بيانات PostgreSQL (Neon) بنجاح ✅");
  } catch (err) {
    console.error("فشل الاتصال بقاعدة البيانات بالتفصيل:\n", err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };