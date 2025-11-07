'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      posts.belongsTo(models.User, {as: 'user_post'})
    }
  }
  posts.init({
    farmer: DataTypes.STRING,
    location: DataTypes.STRING,
    avatar: DataTypes.STRING,
    verified: DataTypes.BOOLEAN,
    farmSize: DataTypes.STRING,
    content: DataTypes.TEXT,
    images: DataTypes.JSON,
    video: DataTypes.JSON,
    likes: DataTypes.INTEGER,
    comments: DataTypes.INTEGER,
    shares: DataTypes.INTEGER,
    tags: DataTypes.JSON,
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Posts',
    tableName: 'posts'
  });
  return posts;
};