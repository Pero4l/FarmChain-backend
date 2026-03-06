'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('relationships', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      follower_id: {
        type: Sequelize.UUID
      },
      followed_id: {
        type: Sequelize.UUID
      },
      following: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('relationships');
  }
};