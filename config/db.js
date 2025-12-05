// const {sequelize, Sequelize} = require('sequelize')
// require('dotenv').config();


// const connection = new Sequelize( process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
//     host: "127.0.0.1",
//     dialect: "mysql"
// })
// module.exports = connection;



// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const connection = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true, 
//       rejectUnauthorized: false,
//     },
//   },
// });

// module.exports = connection;





require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const connection = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host:  process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, 
      ca: fs.readFileSync(path.join(__dirname, "certs/ca.pem")).toString(),
    },
  },
});

module.exports = connection;






