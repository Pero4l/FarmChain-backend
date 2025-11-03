const {sequelize, Sequelize} = require('sequelize')

const connection = new Sequelize('farm_chain', 'sudo_ptb', 'p6565',{
    host: "localhost",
    dialect: "mysql"
})

module.exports = connection