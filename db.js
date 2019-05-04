const Sequelize = require('sequelize');

const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST
} = require('./config');


const db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: 'mssql',
  host: DB_HOST,
  dialectOptions: {
    options: {
      encrypt: true
    }
  }
});

module.exports = db;