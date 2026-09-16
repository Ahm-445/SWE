const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CourseContent = sequelize.define(
  "CourseContent",
  {
    course_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // null = default content visible to all students
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    type: {
      type: DataTypes.ENUM("chapter", "lecture"),
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [
      { fields: ["course_id", "is_default"] },
      { fields: ["course_id", "user_id"] },
      { fields: ["parent_id"] },
    ],
  }
);

module.exports = CourseContent;
