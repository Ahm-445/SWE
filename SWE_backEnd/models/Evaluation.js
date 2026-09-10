const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Target = sequelize.define('Target', {
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM("doctor", "subject"), allowNull: false },
  department: { type: DataTypes.STRING, defaultValue: "هندسة البرمجيات" },
  viewsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
})

const Review = sequelize.define('Review', {
  explanation: { type: DataTypes.FLOAT, allowNull: false },
  dealing: { type: DataTypes.FLOAT, allowNull: false },
  grading: { type: DataTypes.FLOAT, allowNull: false },
  attendance: { type: DataTypes.FLOAT, allowNull: false },
  tags: { type: DataTypes.JSON, defaultValue: [] }, // JSON يدعم المصفوفات في SQLite
  comment: { type: DataTypes.STRING(500) },
  subjectName: { type: DataTypes.STRING },
  grade: { type: DataTypes.STRING },
});

Target.hasMany(Review, { foreignKey: 'targetId' });
Review.belongsTo(Target, { foreignKey: 'targetId' });
module.exports = { Target, Review };