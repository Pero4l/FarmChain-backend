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
      posts.belongsTo(models.Users, { as: 'user_post', foreignKey: "user_id" });

      // Add alias here ⬇⬇
      posts.hasMany(models.Likes, {
        as: "likesData",
        foreignKey: 'post_id'
      });
      posts.hasMany(models.Comments, {
        as: "commentsData",
        foreignKey: 'post_id'
      });
    }

  }
  posts.init({
    user_id: DataTypes.UUID,
    farmer: DataTypes.STRING,
    location: DataTypes.STRING,
    avatar: DataTypes.STRING,
    verified: DataTypes.BOOLEAN,
    farmSize: DataTypes.STRING,
    content: DataTypes.TEXT,
    images: DataTypes.JSON,
    videos: DataTypes.JSON,
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