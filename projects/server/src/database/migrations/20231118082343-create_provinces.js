'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the existing 'provinces' table
    await queryInterface.dropTable('provinces');

    // Create the new 'rajaongkir_provinces' table
    await queryInterface.createTable('rajaongkir_provinces', {
      province_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      province_name: {
        type: Sequelize.STRING(255),
        defaultValue: null,
      },
    });

    // Add any additional commands if needed

    // Return the result of the migration
    return Promise.resolve();
  },

  async down(queryInterface, Sequelize) {
    // Revert by dropping the 'rajaongkir_provinces' table
    await queryInterface.dropTable('rajaongkir_provinces');

    // Recreate the 'provinces' table if needed
    await queryInterface.createTable('provinces', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      province_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
  },
};
