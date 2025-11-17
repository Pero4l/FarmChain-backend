'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class relationships extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // relationship → follower
     relationships.belongsTo(models.Users, {
    foreignKey: "follower_id",
    as: "follower"
  });

  // relationship → followed user
  relationships.belongsTo(models.Users, {
    foreignKey: "followed_id",
    as: "followed"
  });
    }
  }

  
  relationships.init({
    follower_id: DataTypes.INTEGER,
    followed_id: DataTypes.INTEGER,
    following: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Relationship',
    tableName: 'relationships'
  });
  return relationships;
};