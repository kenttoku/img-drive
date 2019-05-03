require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  AZURE_STORAGE_ACCOUNT_NAME: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  AZURE_STORAGE_ACCOUNT_ACCESS_KEY: process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY
};