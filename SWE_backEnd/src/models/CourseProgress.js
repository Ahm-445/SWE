const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const CourseProgress = sequelize.define(
  "CourseProgress",
  {
    course_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    content_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["course_id", "user_id", "content_id"],
      },
    ],
  }
);

module.exports = CourseProgress;
