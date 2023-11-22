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

    await queryInterface.addColumn('addresses', 'receiver_name', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('addresses', 'phone_number', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('addresses', 'receiver_name');
    await queryInterface.removeColumn('addresses', 'phone_number');
  },
};
