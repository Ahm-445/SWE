const xlsx = require('xlsx');
const path = require('path');
// تأكد من أن مسارات استدعاء قاعدة البيانات والمودل صحيحة بناءً على هيكلة مشروعك
const { sequelize } = require('../config/db'); 
const DoctorContact = require('../models/DoctorContact'); 

async function seedContacts() {
  try {
    console.log("جاري الاتصال بقاعدة البيانات...");
    await sequelize.authenticate();
    await sequelize.sync(); // يتأكد من وجود جدول DoctorContact

    console.log("جاري قراءة ملف الإكسل...");
    // تحديد مسار الملف (يفترض أن الملف في نفس المجلد مع هذا السكريبت)
    const filePath = path.join(__dirname, 'contacts.xlsx');
    const workbook = xlsx.readFile(filePath);
    
    // قراءة الورقة الأولى من الإكسل
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log(`تم العثور على ${rows.length} دكتور في الملف. جاري الحفظ...`);

    let count = 0;
    for (const row of rows) {
      // أسماء الأعمدة مطابقة تماماً لما هو موجود في ملفك
      const name = row['اسم الدكتور'];
      const email = row['البريد الإلكتروني'];
      const office = row['رقم المكتب'];
      const department = row['القسم ']; // لاحظ المسافة في نهاية كلمة القسم

      if (name) {
        // نستخدم findOrCreate لكي لا تتكرر البيانات إذا شغلنا السكريبت مرتين
        await DoctorContact.findOrCreate({
          where: { name: name.trim() },
          defaults: {
            email: email ? email.toString().trim() : 'غير متوفر',
            office: office ? office.toString().trim() : 'غير متوفر',
            department: department ? department.toString().trim() : 'غير متوفر'
          }
        });
        count++;
      }
    }

    console.log(`✅ تم إضافة/تحديث ${count} جهة اتصال بنجاح في قاعدة البيانات!`);
  } catch (error) {
    console.error("❌ حدث خطأ أثناء رفع البيانات:", error);
  } finally {
    console.log("جاري إغلاق الاتصال...");
    process.exit(); 
  }
}

seedContacts();