const fs = require('fs');
const { sequelize } = require('../config/db.js'); 
const { Target } = require('../models/target.js'); 

const seedDatabase = async () => {
  try {
    // 1. قراءة ملف البيانات
    const rawData = fs.readFileSync('./test.targets.json', 'utf8');
    const targetsData = JSON.parse(rawData);

    // 2. تنظيف البيانات لتتناسب مع SQLite (تجاهل _id و __v)
    const cleanData = targetsData.map(item => ({
      name: item.name,
      type: item.type,
      department: item.department || "هندسة البرمجيات", // قيمة افتراضية في حال عدم وجود قسم
      viewsCount: item.viewsCount || 0
    }));

    // 3. الاتصال بقاعدة البيانات
    await sequelize.authenticate();
    console.log("Connected to SQLite Database.");

    // 4. إدخال جميع البيانات دفعة واحدة
    await Target.bulkCreate(cleanData);
    console.log(`Successfully seeded ${cleanData.length} records!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();