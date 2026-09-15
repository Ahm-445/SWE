const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
    validate: {
      isKsuEmail(value) {
        // Enforces format: 9 digits followed by @student.ksu.edu.sa (e.g., 445102675@student.ksu.edu.sa)
        if (!/^\d{9}@student\.ksu\.edu\.sa$/.test(value)) {
          throw new Error('Email must be a valid KSU student email.');
        }
      }
    }
  },
  state: { 
    type: DataTypes.ENUM('pending', 'active'), 
    defaultValue: 'pending',
    allowNull: false
  },
  role: {
  type: DataTypes.ENUM('student', 'admin'),
  defaultValue: 'student',
  allowNull: false
},
  term_level: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User;