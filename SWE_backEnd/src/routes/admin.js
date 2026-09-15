const express = require('express');
const User = require('../models/User.js');
const { authenticate, requireAdmin } = require('../middlewares/authMiddleware.js');

const router = express.Router();


router.get(
  '/students/pending',
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const students = await User.findAll({
        where: {
          role: 'student',
          state: 'pending'
        },
        attributes: [
          'id',
          'name',
          'email',
          'term_level',
          'state',
          'createdAt'
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json(students);
    } catch (error) {
      console.error('Error fetching pending students:', error);

      res.status(500).json({
        error: 'Failed to fetch pending students.'
      });
    }
  }
);


/*
  GET /api/admin/students

  Get all students
*/
router.get(
  '/students',
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const students = await User.findAll({
        where: {
          role: 'student'
        },
        attributes: [
          'id',
          'name',
          'email',
          'term_level',
          'state',
          'createdAt'
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json(students);
    } catch (error) {
      console.error('Error fetching students:', error);

      res.status(500).json({
        error: 'Failed to fetch students.'
      });
    }
  }
);


/*
  PATCH /api/admin/students/:id/approve

  Approve a student
*/
router.patch(
  '/students/:id/approve',
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const student = await User.findOne({
        where: {
          id,
          role: 'student'
        }
      });

      if (!student) {
        return res.status(404).json({
          error: 'Student not found.'
        });
      }

      if (student.state === 'active') {
        return res.status(400).json({
          error: 'Student is already approved.'
        });
      }

      student.state = 'active';

      await student.save();

      res.json({
        message: 'Student approved successfully.',
        student: {
          id: student.id,
          name: student.name,
          email: student.email,
          term_level: student.term_level,
          state: student.state
        }
      });

    } catch (error) {
      console.error('Error approving student:', error);

      res.status(500).json({
        error: 'Failed to approve student.'
      });
    }
  }
);

module.exports = router;