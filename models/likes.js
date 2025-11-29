'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      likes.belongsTo(models.Users, { foreignKey: 'user_id' });
      likes.belongsTo(models.Posts, { foreignKey: 'post_id' });
    }
  }
  likes.init({
    user_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER,
    is_like: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Likes',
    tableName: 'likes',
  });
  return likes;
};