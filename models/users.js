'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      // Existing associations
      Users.hasMany(models.Notifications, { foreignKey: 'user_id' });
      Users.hasMany(models.Posts, { foreignKey: 'user_id' });
      Users.hasOne(models.Profile, { foreignKey: 'user_id' });
      Users.hasMany(models.Likes, { foreignKey: 'user_id' });
      Users.hasMany(models.Comments, { foreignKey: 'user_id' });


      // 🔥 Followers (users that follow THIS user)
      Users.belongsToMany(models.Users, {
        through: models.Relationship,
        foreignKey: "followed_id",
        otherKey: "follower_id",
        as: "followers"
      });

      // 🔥 Following (users THIS user is following)
      Users.belongsToMany(models.Users, {
        through: models.Relationship,
        foreignKey: "follower_id",
        otherKey: "followed_id",
        as: "following"
      });

      // Messaging associations
      Users.hasMany(models.Message, {
        foreignKey: "sender_id",
      });

      Users.hasMany(models.ConversationMember, {
        foreignKey: "user_id",
      });
    }

  }
  Users.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    gender: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_no: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    password: DataTypes.STRING,
    otpCode: DataTypes.STRING,
    otpExpiresAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
  });
  return Users;
};