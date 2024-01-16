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
    await queryInterface.changeColumn('orders', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    });

    await queryInterface.addColumn('orders', 'branch_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'branches',
        key: 'id',
      },
    });

    await queryInterface.changeColumn('orders', 'payment_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('orders', 'voucher_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('orders', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('order_details', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
    // invoiceNo
    await queryInterface.addColumn('orders', 'invoiceNo', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('orders', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.removeColumn('orders', 'branch_id');

    await queryInterface.changeColumn('orders', 'payment_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('orders', 'voucher_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.removeColumn('orders', 'deleted_at');
    await queryInterface.removeColumn('order_details', 'deleted_at');
    await queryInterface.removeColumn('orders', 'invoiceNo');
  },
};
