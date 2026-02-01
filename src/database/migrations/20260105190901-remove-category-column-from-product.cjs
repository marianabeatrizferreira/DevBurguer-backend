'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
   await queryInterface.removeColumn('products', 'categgory');
     
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'categgory', {
      type: Sequelize.STRING(),
        allowNull: true
    });
     
  }
};
