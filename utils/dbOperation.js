const { Sequelize } = require('sequelize');

// Replace these values with your MySQL credentials
const sequelize = new Sequelize('test', 'root', '', {
  host: 'localhost', // or your MySQL server IP
  dialect: 'mysql',
});

module.exports = sequelize;
