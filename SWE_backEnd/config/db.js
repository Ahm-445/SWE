const { Sequelize } = require('sequelize');

if (!process.env.DATABASE_URL) {
  console.error("خطأ: لم يتم العثور على DATABASE_URL في متغيرات البيئة (.env)");
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // مطلوب للتوافق مع اتصالات السحابة وشهادات SSL
    }
  },
  logging: false, // لمنع طباعة أوامر SQL في التيرمنال
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("تم الاتصال بقاعدة بيانات PostgreSQL (Neon) بنجاح ✅");
  } catch (err) {
    console.error("فشل الاتصال بقاعدة البيانات:", err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };