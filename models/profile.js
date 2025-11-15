'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      profile.belongsTo(models.Users, {as: 'user_profile'})
    }
  }
  profile.init({
    user_id: DataTypes.INTEGER,
    bio: DataTypes.STRING,
    organization: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover_avatar: DataTypes.STRING,
    location: DataTypes.STRING,
    verified: DataTypes.BOOLEAN,
    share_account: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles'
  });
  return profile;
};