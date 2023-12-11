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
    await queryInterface.removeColumn('categories', 'is_deleted');
    await queryInterface.addColumn('categories', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('categories', 'branch_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
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
    await queryInterface.removeColumn('categories', 'deleted_at');
    await queryInterface.removeColumn('categories', 'branch_id');
    await queryInterface.addColumn('categories', 'is_deleted', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },
};
