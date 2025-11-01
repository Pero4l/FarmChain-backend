const { Sequelize } = require('sequelize');

// Replace these values with your MySQL credentials
const sequelize = new Sequelize('database_name', 'username', 'password', {
  host: 'localhost', // or your MySQL server IP
  dialect: 'mysql',
});

module.exports = sequelize;
