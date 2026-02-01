'use strict';

const { Reference } = require('yup');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('products', 'category_id', {
      type: Sequelize.INTEGER,
       references: {
      model: 'categories',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    });
   
     
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'category_id');
     
  }
};
