'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Comment.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
            Comment.belongsTo(models.Posts, { foreignKey: 'post_id', as: 'post' });
        }
    }
    Comment.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: DataTypes.UUID,
        post_id: DataTypes.UUID,
        content: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Comments',
        tableName: 'comments',
    });
    return Comment;
};
