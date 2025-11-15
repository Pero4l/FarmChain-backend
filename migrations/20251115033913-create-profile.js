'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      bio: {
        type: Sequelize.STRING(170),
        defaultValue: 'Excited to be part of the FarmChain community, let connect and grow together!'
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-k83MyoiH43lpI6Y-TY17A2JCPudD_7Av9A&s'
      },
      cover_avatar: {
        type: Sequelize.STRING,
        defaultValue: 'https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y292ZXIlMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D&w=1000&q=80'
      },
      organization: {
        type: Sequelize.STRING(100)
      },
      location: {
        type: Sequelize.STRING
      },
       verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
        
      },
      share_account: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('profiles');
  }
};