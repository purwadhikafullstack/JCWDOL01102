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

    await queryInterface.addColumn('stock_histories', 'branch_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'branches',
        key: 'id',
      },
    });

    await queryInterface.addColumn('stock_histories', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    });

    await queryInterface.addColumn('stock_histories', 'product_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'products',
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

    await queryInterface.removeColumn('stock_histories', 'branch_id');
    await queryInterface.removeColumn('stock_histories', 'user_id');
    await queryInterface.removeColumn('stock_histories', 'product_id');
  },
};
