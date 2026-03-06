'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class notifications extends Model {
    static associate(models) {
      // define association here
      notifications.belongsTo(models.Users, {
        as: "user_notification",
        foreignKey: "user_id" // Use the actual column in your table
      });
    }
  }

  notifications.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: DataTypes.UUID,
    type: DataTypes.STRING,
    notification: DataTypes.STRING,
    is_read: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Notifications',
    tableName: 'notifications'
  });

  return notifications;
};
