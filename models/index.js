require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const usersModel = require('./users'); // <-- import the model factory

// ✅ Initialize Sequelize once
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    logging: false,
  }
);

// ✅ Initialize all models
const users = usersModel(sequelize, DataTypes); // <-- initialize your model

// ✅ Test connection
sequelize.authenticate()
  .then(() => console.log('✅ Connected to MySQL'))
  .catch(err => console.error('❌ Database connection failed:', err));

// ✅ Export Sequelize + models
module.exports = { sequelize, users };
