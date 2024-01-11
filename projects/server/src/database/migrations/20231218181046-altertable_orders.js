'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('orders', 'invoiceNo');
    await queryInterface.addColumn('orders', 'invoice_no', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('orders', 'invoice_no');
    await queryInterface.addColumn('orders', 'invoiceNo', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
  },
};
