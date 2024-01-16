/* eslint-disable max-lines-per-function */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      image_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      branch_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      name: {
        type: Sequelize.STRING(255),
        defaultValue: null,
      },
      password: {
        type: Sequelize.STRING(255),
        defaultValue: null,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING(255),
        defaultValue: null,
      },
      referral_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      role_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      birthdate: {
        type: Sequelize.DATEONLY,
        defaultValue: null,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      reset_password_token: {
        type: Sequelize.STRING(255),
        defaultValue: null,
      },
      verify_token: {
        type: Sequelize.STRING(255),
        defaultValue: null,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
