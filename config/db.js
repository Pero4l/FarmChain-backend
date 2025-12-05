// const {sequelize, Sequelize} = require('sequelize')
// require('dotenv').config();


// const connection = new Sequelize( process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,{
//     host: "127.0.0.1",
//     dialect: "mysql"
// })
// module.exports = connection;


// const { Sequelize } = require('sequelize');
// require('dotenv').config();


require('dotenv').config();

const { Sequelize } = require('sequelize');


const connection = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, 
      rejectUnauthorized: false,
    },
  },
});

module.exports = connection;



// const { Sequelize } = require('sequelize');
// require('dotenv').config();


// const fs = require('fs');
// const path = require('path');

// const connection = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: true,
//       ca: fs.readFileSync(path.join(__dirname, 'certs/ca.pem')).toString(),
//     },
//   },
// });

// module.exports = connection;









