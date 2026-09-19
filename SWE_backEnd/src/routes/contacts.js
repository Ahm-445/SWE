const express = require('express');
const { Op } = require('sequelize');
const DoctorContact = require('../models/DoctorContact');
const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    if(q.length > 50){
      return res.status(400).json({
        error:"Search too long"
      });
    }

    const doctors = await DoctorContact.findAll({
      where: { name: { [Op.iLike]: `%${q.trim()}%` } }, // استخدام iLike في Postgres
      limit: 8
    });
    
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: "خطأ في البحث عن بيانات التواصل" });
  }
});

module.exports = router;