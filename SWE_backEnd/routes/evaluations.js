import express from "express";
import { Target, Review } from "../models/Evaluation.js";

const router = express.Router();


router.get("/search", async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) return res.json([]);

    const filter = {
      name: { $regex: q.trim(), $options: "i" },
      ...(type && { type }),
    };

    const targets = await Target.find(filter).limit(6).lean();
    res.json(targets);
  } catch (error) {
    res.status(500).json({ error: "خطأ في البحث" });
  }
});


router.get("/target/:id", async (req, res) => {
  try {
    const target = await Target.findById(req.params.id);
    if (!target) return res.status(404).json({ error: "غير موجود" });


    target.viewsCount += 1;
    await target.save();

    const reviews = await Review.find({ targetId: target._id }).sort({ createdAt: -1 });

    const total = reviews.length;
    let avg = { explanation: 0, dealing: 0, grading: 0, attendance: 0, final: 0 };
    const tagCounts = {};

    if (total > 0) {
      reviews.forEach((r) => {
        avg.explanation += r.ratings.explanation;
        avg.dealing += r.ratings.dealing;
        avg.grading += r.ratings.grading;
        avg.attendance += r.ratings.attendance;

        (r.tags || []).forEach((t) => {
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        });
      });


      avg.explanation = ((avg.explanation / total) * 20).toFixed(1);
      avg.dealing = ((avg.dealing / total) * 20).toFixed(1);
      avg.grading = ((avg.grading / total) * 20).toFixed(1);
      avg.attendance = ((avg.attendance / total) * 20).toFixed(1);

      const totalScoreSum =
        parseFloat(avg.explanation) +
        parseFloat(avg.dealing) +
        parseFloat(avg.grading) +
        parseFloat(avg.attendance);
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


router.post("/review", async (req, res) => {
  try {
    const { targetId, targetName, type, ratings, tags, comment, subjectName, grade } = req.body;

    let target;
    if (targetId) {
      target = await Target.findById(targetId);
    } else if (targetName) {

        target = await Target.findOneAndUpdate(
        { name: targetName.trim(), type: type || "doctor" },
        { name: targetName.trim(), type: type || "doctor" },
        { upsert: true, new: true }
      );
    }

    if (!target) return res.status(400).json({ error: "يجب تحديد الدكتور أو المادة" });

    const newReview = new Review({
      targetId: target._id,
      ratings,
      tags: tags?.slice(0, 5) || [],
      comment,
      subjectName,
      grade,
    });

    await newReview.save();
    res.status(201).json({ success: true, targetId: target._id });
  } catch (error) {
    res.status(500).json({ error: "تعذر حفظ التقييم" });
  }
});

export default router;