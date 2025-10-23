require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

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

// ✅ Test connection
sequelize.authenticate()
  .then(() => console.log('✅ Connected to MySQL'))
  .catch(err => console.error('❌ Database connection failed:', err));

// ✅ Define model for existing table
const Users = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  phone_no: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  state: {
    type: DataTypes.STRING
  },
  country: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  registerd_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'users',  // use your existing table
  timestamps: false    // disables createdAt/updatedAt
});

module.exports = { sequelize, Users };
