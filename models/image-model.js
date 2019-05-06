const Sequelize = require('sequelize');
const db = require('../db');

const Image = db.define('image', {
  link: {
    type: Sequelize.STRING,
    allowNull: false
  },
  user: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
});

module.exports = Image;