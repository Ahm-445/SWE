const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CourseExam = sequelize.define(
  "CourseExam",
  {
    course_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // null = default exam visible to all students
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    exam_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    content_ids: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [
      { fields: ["course_id", "exam_date"] },
      { fields: ["course_id", "user_id"] },
    ],
  }
);

module.exports = CourseExam;
