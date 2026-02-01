'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
  await queryInterface.sequelize.query(
    'CREATE EXTENSION IF NOT EXISTS "pgcrypto";'
  );

  await queryInterface.createTable('users', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
    },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    
    
    
    });
     
  },

  async down (queryInterface) {
    await queryInterface.dropTable('users');
     
  }
};
