const path = require('path');
const xlsx = require('xlsx');
require('dotenv').config();

const { sequelize, connectDB } = require('../config/db.js');
const DoctorContact = require('../models/DoctorContact');

const seedContacts = async () => {
  try {
    // 1. الاتصال بقاعدة البيانات ومزامنة الجدول
    await connectDB();
    await sequelize.sync();

    // 2. قراءة ملف الإكسل
    const filePath = path.join(__dirname, 'contacts.xlsx'); // عدل المسار إذا وضعت الملف في مجلد آخر
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // 3. تجهيز البيانات ومطابقتها مع حقول DoctorContact
    const contacts = sheetData.map((row) => ({
      name: (row['اسم الدكتور'] || '').toString().trim(),
      email: row['البريد الإلكتروني'] ? row['البريد الإلكتروني'].toString().trim() : null,
      office: row['رقم المكتب'] ? row['رقم المكتب'].toString().trim() : null,
      department: (row['القسم '] || row['القسم'] || '').toString().trim() || null,
    })).filter((c) => c.name.length > 0);

    console.log(`جارٍ إدخال ${contacts.length} جهة اتصال إلى قاعدة البيانات...`);

    // 4. مسح السجلات القديمة لتفادي التكرار (اختياري) ثم إدخال الدفعة بالكامل
    // await DoctorContact.destroy({ where: {}, truncate: true });

    await DoctorContact.bulkCreate(contacts, {
      validate: true,
      ignoreDuplicates: true,
    });

    console.log('✅ تم إدخال جميع جهات الاتصال في قاعدة البيانات بنجاح!');
    process.exit(0);
  } catch (error) {
    console.error('❌ حدث خطأ أثناء إدخال البيانات:', error);
    process.exit(1);
  }
};

seedContacts();