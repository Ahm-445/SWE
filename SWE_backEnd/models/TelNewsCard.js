const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TelNewsCard = sequelize.define('TelNewsCard', {
  telId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  chatId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  imageUrl: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING, defaultValue: 'Main News' },
  postedAt: { type: DataTypes.DATE, allowNull: false }
});

module.exports = TelNewsCard;