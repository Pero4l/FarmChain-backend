const {DataTypes} = require("sequelize")
const connection = require("../config/db")

const User =
 connection.define('newUser', {
  id:{
    type: DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },

  name:{
    type: DataTypes.STRING,
    allowNull:false
  },
  email:{
    type: DataTypes.STRING,
    allowNull:false 
  }
},
{
  tableName: "users2",
  timestamps: true
}
)

module.exports = User