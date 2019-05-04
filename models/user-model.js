const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
});

module.exports = User;