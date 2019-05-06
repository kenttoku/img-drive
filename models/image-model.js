const Sequelize = require('sequelize');
const db = require('../db');

const Image = db.define('image', {
  url: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: true
  }
}, {
  timestamps: false,
});

module.exports = Image;