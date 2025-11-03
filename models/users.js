const {DataTypes} = require("sequelize")
const connection = require("../config/db")

const User =
 connection.define('newUser', {
   id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('Male','Female','Unknown'),
      allowNull: true,
      defaultValue: "Unknown"
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    phone_no: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
},
{
  tableName: "users",
  timestamps: true
}
)

module.exports = User