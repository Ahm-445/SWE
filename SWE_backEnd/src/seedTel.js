const fs = require('fs');
const { sequelize } = require('../config/db'); 
const TelNewsCard = require('../models/TelNewsCard'); // تأكد من مسار الموديل

const seedNewsDatabase = async () => {
  try {
    // 1. قراءة ملف بيانات الأخبار
    const rawData = fs.readFileSync('./test.telnewscards.json', 'utf8');
    const newsData = JSON.parse(rawData);

    // 2. تنظيف البيانات واستخراج التواريخ من كائن $date
    const cleanData = newsData.map(item => ({
      telId: item.telId,
      chatId: item.chatId,
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl,
      category: item.category || 'Main News',
      // تحويل كائن $date إلى تاريخ تفهمه SQLite
      postedAt: new Date(item.postedAt.$date), 
      createdAt: item.createdAt ? new Date(item.createdAt.$date) : new Date(),
      updatedAt: item.updatedAt ? new Date(item.updatedAt.$date) : new Date()
    }));

    // 3. الاتصال بقاعدة البيانات
    await sequelize.authenticate();
    console.log("Connected to SQLite Database.");

    // 4. إدخال البيانات (ignoreDuplicates لتجنب الخطأ إذا تم التشغيل مرتين)
    await TelNewsCard.bulkCreate(cleanData, { ignoreDuplicates: true });
    console.log(`Successfully seeded ${cleanData.length} news cards!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding news data:", error);
    process.exit(1);
  }
};

seedNewsDatabase();