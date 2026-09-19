const express = require("express");
const { Op } = require("sequelize");
const { body, query, param } = require('express-validator');
const { Target, Review } = require("../models/Evaluation.js");
const validateInputs = require('../middlewares/validateInputs');
const router = express.Router();

router.get("/search", [
  query('q').optional().isString().trim().escape(),
  query('type').optional().isIn(['doctor', 'subject'])
], validateInputs, async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) return res.json([]);

    const whereClause = { name: { [Op.iLike]: `%${q.trim()}%` } }; // استبدال Op.like بـ Op.iLike
    if (type) whereClause.type = type;

    const targets = await Target.findAll({ where: whereClause, limit: 6 });
    res.json(targets);
  } catch (error) {
    res.status(500).json({ error: "خطأ في البحث" });
  }
});

router.get("/target/:id", [
  param('id').isInt().withMessage('المعرف يجب أن يكون رقماً')
], validateInputs, async (req, res) => {
  try {
    const target = await Target.findByPk(req.params.id);
    if (!target) return res.status(404).json({ error: "غير موجود" });

    target.viewsCount += 1;
    await target.save();

    const reviews = await Review.findAll({ 
      where: { targetId: target.id }, 
      order: [['createdAt', 'DESC']] 
    });

    const total = reviews.length;
    let avg = { explanation: 0, dealing: 0, grading: 0, attendance: 0, final: 0 };
    const tagCounts = {};

    if (total > 0) {
      reviews.forEach((r) => {
        avg.explanation += r.explanation;
        avg.dealing += r.dealing;
        avg.grading += r.grading;
        avg.attendance += r.attendance;

        (r.tags || []).forEach((t) => {
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      });

      avg.explanation = ((avg.explanation / total) * 20).toFixed(1);
      avg.dealing = ((avg.dealing / total) * 20).toFixed(1);
      avg.grading = ((avg.grading / total) * 20).toFixed(1);
      avg.attendance = ((avg.attendance / total) * 20).toFixed(1);

      const totalScoreSum = parseFloat(avg.explanation) + parseFloat(avg.dealing) + 
                            parseFloat(avg.grading) + parseFloat(avg.attendance);
      avg.final = (totalScoreSum / 4).toFixed(1);
    }

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    res.json({
      target,
      stats: { totalRatings: total, averages: avg, topTags },
      reviews,
    });
  } catch (error) {
    res.status(500).json({ error: "خطأ في جلب التقييمات" });
  }
});

router.post("/review", [
  body('targetId').optional().isInt(),
  body('targetName').optional().isString().trim().escape(),
  body('type').optional().isIn(['doctor', 'subject']),
  body('ratings.explanation').isFloat({ min: 1, max: 5 }),
  body('ratings.dealing').isFloat({ min: 1, max: 5 }),
  body('ratings.grading').isFloat({ min: 1, max: 5 }),
  body('ratings.attendance').isFloat({ min: 1, max: 5 }),
  body('tags.*').isString().trim().escape(),
  body('comment').optional().isString().trim().isLength({ max: 500 }).escape(),
  body('subjectName').optional().isString().trim().escape(),
  body('grade').optional().isString().trim().escape()
], validateInputs, async (req, res) => {
  try {
    const { targetId, targetName, type, ratings, tags, comment, subjectName, grade } = req.body;
    let target;

    if (targetId) {
      target = await Target.findByPk(targetId);
    } else if (targetName) {
      const [foundTarget] = await Target.findOrCreate({
        where: { name: targetName.trim(), type: type || "doctor" },
        defaults: { name: targetName.trim(), type: type || "doctor" }
      });
      target = foundTarget;
    }

    if (!target) return res.status(400).json({ error: "يجب تحديد الدكتور أو المادة" });

    await Review.create({
      targetId: target.id,
      explanation: ratings.explanation,
      dealing: ratings.dealing,
      grading: ratings.grading,
      attendance: ratings.attendance,
      tags: tags?.slice(0, 5) || [],
      comment,
      subjectName,
      grade,
    });

    res.status(201).json({ success: true, targetId: target.id });
  } catch (error) {
    res.status(500).json({ error: "تعذر حفظ التقييم" });
  }
});

module.exports = router;