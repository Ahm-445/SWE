const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DoctorContact = sequelize.define('DoctorContact', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  office: { type: DataTypes.STRING },
  department: { type: DataTypes.STRING } 
});

module.exports = DoctorContact;