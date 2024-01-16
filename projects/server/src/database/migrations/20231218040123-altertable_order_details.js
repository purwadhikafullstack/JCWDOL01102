/* eslint-disable @typescript-eslint/no-unused-vars */
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
    await queryInterface.addColumn('order_details', 'price', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.changeColumn('order_details', 'order_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('order_details', 'price');
    await queryInterface.changeColumn('order_details', 'order_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
