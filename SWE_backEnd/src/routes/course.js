const express = require("express");
const router = express.Router();

const {
  authenticate,
  requireAdmin,
} = require("../middlewares/authMiddleware");

const CourseContent = require("../models/CourseContent");
const CourseExam = require("../models/CourseExam");
const CourseProgress = require("../models/CourseProgress");

const normalizeId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const normalizeOrder = (value) => {
  const order = Number(value);
  return Number.isInteger(order) && order >= 0 ? order : 0;
};

const getVisibleContent = async (courseId, userId) => {
  return CourseContent.findAll({
    where: {
      course_id: courseId,
      [require("sequelize").Op.or]: [
        { is_default: true },
        { user_id: userId },
      ],
    },
    order: [
      ["order_index", "ASC"],
      ["id", "ASC"],
    ],
  });
};

// GET COURSE CONTENT
router.get("/:courseId/content", authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;

    const content = await getVisibleContent(courseId, req.user.id);

    res.json({
      defaultContent: content.filter((item) => item.is_default),
      userContent: content.filter(
        (item) => !item.is_default && item.user_id === req.user.id
      ),
    });
  } catch (error) {
    console.error("GET course content:", error);
    res.status(500).json({ error: "Failed to load course content." });
  }
});

// ADD STUDENT CONTENT
router.post("/:courseId/content", authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { parent_id, type, title, description, order_index } = req.body;

    if (!["chapter", "lecture"].includes(type)) {
      return res.status(400).json({ error: "Invalid content type." });
    }

    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: "Title is required." });
    }

    let parentId = null;

    if (type === "lecture") {
      parentId = normalizeId(parent_id);

      if (!parentId) {
        return res.status(400).json({
          error: "Lecture must belong to a chapter.",
        });
      }

      const parent = await CourseContent.findOne({
        where: {
          id: parentId,
          course_id: courseId,
          type: "chapter",
          [require("sequelize").Op.or]: [
            { is_default: true },
            { user_id: req.user.id },
          ],
        },
      });

      if (!parent) {
        return res.status(400).json({
          error: "Parent chapter was not found.",
        });
      }
    }

    const content = await CourseContent.create({
      course_id: courseId,
      user_id: req.user.id,
      parent_id: parentId,
      type,
      title: String(title).trim(),
      description: description ? String(description).trim() : null,
      order_index: normalizeOrder(order_index),
      is_default: false,
    });

    res.status(201).json(content);
  } catch (error) {
    console.error("POST student content:", error);
    res.status(500).json({ error: "Failed to add course content." });
  }
});

// GET EXAMS
router.get("/:courseId/exams", authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { Op } = require("sequelize");

    const exams = await CourseExam.findAll({
      where: {
        course_id: courseId,
        [Op.or]: [
          { is_default: true },
          { user_id: req.user.id },
        ],
      },
      order: [["exam_date", "ASC"], ["id", "ASC"]],
    });

    res.json({
      defaultExams: exams.filter((exam) => exam.is_default),
      userExams: exams.filter(
        (exam) => !exam.is_default && exam.user_id === req.user.id
      ),
    });
  } catch (error) {
    console.error("GET exams:", error);
    res.status(500).json({ error: "Failed to load exams." });
  }
});

// ADD STUDENT EXAM
router.post("/:courseId/exams", authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name, exam_date, content_ids } = req.body;

    if (!name || !String(name).trim() || !exam_date) {
      return res.status(400).json({
        error: "Exam name and date are required.",
      });
    }

    const ids = Array.isArray(content_ids)
      ? content_ids.map(normalizeId).filter(Boolean)
      : [];

    const exam = await CourseExam.create({
      course_id: courseId,
      user_id: req.user.id,
      name: String(name).trim(),
      exam_date,
      content_ids: [...new Set(ids)],
      is_default: false,
    });

    res.status(201).json(exam);
  } catch (error) {
    console.error("POST student exam:", error);
    res.status(500).json({ error: "Failed to add exam." });
  }
});

// GET COURSE PROGRESS
router.get("/:courseId/progress", authenticate, async (req, res) => {
  try {
    const progress = await CourseProgress.findAll({
      where: {
        course_id: req.params.courseId,
        user_id: req.user.id,
      },
      order: [["content_id", "ASC"]],
    });

    res.json(progress);
  } catch (error) {
    console.error("GET progress:", error);
    res.status(500).json({ error: "Failed to load course progress." });
  }
});

// UPDATE COURSE PROGRESS
router.patch(
  "/:courseId/progress/:contentId",
  authenticate,
  async (req, res) => {
    try {
      const { courseId, contentId } = req.params;
      const id = normalizeId(contentId);

      if (!id) {
        return res.status(400).json({ error: "Invalid content id." });
      }

      const completed =
        req.body.completed === true || req.body.completed === false
          ? req.body.completed
          : null;

      if (completed === null) {
        return res.status(400).json({
          error: "completed must be true or false.",
        });
      }

      const content = await CourseContent.findOne({
        where: {
          id,
          course_id: courseId,
          [require("sequelize").Op.or]: [
            { is_default: true },
            { user_id: req.user.id },
          ],
        },
      });

      if (!content) {
        return res.status(404).json({
          error: "Course content not found.",
        });
      }

      const [progress] = await CourseProgress.findOrCreate({
        where: {
          course_id: courseId,
          user_id: req.user.id,
          content_id: id,
        },
        defaults: { completed },
      });

      if (progress.completed !== completed) {
        progress.completed = completed;
        await progress.save();
      }

      res.json(progress);
    } catch (error) {
      console.error("PATCH progress:", error);
      res.status(500).json({ error: "Failed to update course progress." });
    }
  }
);

// ADMIN - ADD DEFAULT CONTENT
router.post(
  "/:courseId/admin/content",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const { courseId } = req.params;
      const { parent_id, type, title, description, order_index } = req.body;

      if (!["chapter", "lecture"].includes(type)) {
        return res.status(400).json({ error: "Invalid content type." });
      }

      if (!title || !String(title).trim()) {
        return res.status(400).json({ error: "Title is required." });
      }

      let parentId = null;

      if (type === "lecture") {
        parentId = normalizeId(parent_id);

        if (!parentId) {
          return res.status(400).json({
            error: "Lecture must belong to a chapter.",
          });
        }

        const parent = await CourseContent.findOne({
          where: {
            id: parentId,
            course_id: courseId,
            type: "chapter",
            is_default: true,
            user_id: null,
          },
        });

        if (!parent) {
          return res.status(400).json({
            error: "Default parent chapter was not found.",
          });
        }
      }

      const content = await CourseContent.create({
        course_id: courseId,
        user_id: null,
        parent_id: parentId,
        type,
        title: String(title).trim(),
        description: description ? String(description).trim() : null,
        order_index: normalizeOrder(order_index),
        is_default: true,
      });

      res.status(201).json(content);
    } catch (error) {
      console.error("POST admin content:", error);
      res.status(500).json({
        error: "Failed to create default content.",
      });
    }
  }
);

// ADMIN - ADD DEFAULT EXAM
router.post(
  "/:courseId/admin/exams",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const { courseId } = req.params;
      const { name, exam_date, content_ids } = req.body;

      if (!name || !String(name).trim() || !exam_date) {
        return res.status(400).json({
          error: "Exam name and date are required.",
        });
      }

      const ids = Array.isArray(content_ids)
        ? content_ids.map(normalizeId).filter(Boolean)
        : [];

      const exam = await CourseExam.create({
        course_id: courseId,
        user_id: null,
        name: String(name).trim(),
        exam_date,
        content_ids: [...new Set(ids)],
        is_default: true,
      });

      res.status(201).json(exam);
    } catch (error) {
      console.error("POST admin exam:", error);
      res.status(500).json({
        error: "Failed to create default exam.",
      });
    }
  }
);

module.exports = router;
