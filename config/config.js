// require('dotenv').config();

// module.exports = {
//   "development": {
//     "username": process.env.DB_USER,
//     "password": process.env.DB_PASSWORD,
//     "database": process.env.DB_NAME,
//     "host": process.env.DB_HOST,
//     "dialect": "postgres"
//   },
//   "test": {
//      "username": process.env.DB_USER,
//     "password": process.env.DB_PASSWORD,
//     "database": process.env.DB_NAME,
//     "host": process.env.DB_HOST,
//     "dialect": "postgres"
//   },
//   "production": {
//      "username": process.env.DB_USER,
//     "password": process.env.DB_PASSWORD,
//     "database": process.env.DB_NAME,
//     "host": process.env.DB_HOST,
//     "dialect": "postgres"
//   }
// }


require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};


// require('dotenv').config();

// module.exports = {
//   development: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "postgres",
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false
//       },
//       sslmode: "require"
//     }
//   },
//   production: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "postgres",
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false
//       },
//       sslmode: "require"
//     }
//   }
// }