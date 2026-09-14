const path = require('path');
// قراءة ملف .env من المجلد الرئيسي للمشروع
require('dotenv').config();

const xlsx = require('xlsx');
const { sequelize, connectDB } = require('../config/db');
const { Target } = require('../models/Evaluation');

const seedDoctors = async () => {
  try {
    // 1. الاتصال بقاعدة البيانات ومزامنة الجداول
    await connectDB();
    await sequelize.sync();

    // 2. قراءة ملف الإكسل doctors.xlsx
    // تأكد من وضع doctors.xlsx في المجلد الرئيسي أو بجانب هذا الملف
    const filePath = path.resolve(__dirname, './doctors.xlsx'); 
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // 3. تجهيز بيانات الدكاترة لمطابقة مودل Target
    const doctors = sheetData.map((row) => {
      const name = (row['اسم الدكتور'] || '').toString().trim();
      const department = (row['القسم '] || row['القسم'] || 'هندسة البرمجيات').toString().trim();

      return {
        name,
        type: 'doctor',
        department: department || 'هندسة البرمجيات',
        viewsCount: 0
      };
    }).filter((doc) => doc.name.length > 0);

    console.log(`تمت قراءة ${doctors.length} دكتور من الملف، جارٍ الإدخال في قاعدة البيانات...`);

    let addedCount = 0;
    let skippedCount = 0;

    // 4. الإدخال مع التحقق لعدم تكرار الدكاترة المسجلين مسبقاً
    for (const doc of doctors) {
      const [record, created] = await Target.findOrCreate({
        where: { name: doc.name, type: 'doctor' },
        defaults: doc
      });

      if (created) {
        addedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`✅ اكتملت العملية بنجاح:`);
    console.log(`- تم إدخال: ${addedCount} دكتور جديد.`);
    console.log(`- تم تخطي (موجود مسبقاً): ${skippedCount} دكتور.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ حدث خطأ أثناء إدخال الدكاترة:', error);
    process.exit(1);
  }
};

seedDoctors();