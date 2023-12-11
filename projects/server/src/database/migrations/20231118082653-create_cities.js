'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the existing 'cities' table
    await queryInterface.dropTable('cities');

    // Create the new 'rajaongkir_cities' table
    await queryInterface.createTable('rajaongkir_cities', {
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      province_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      city_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      postal_code: {
        type: Sequelize.CHAR(5),
        allowNull: false,
      },
    });

    // Add any additional commands if needed

    // Return the result of the migration
    return Promise.resolve();
  },

  async down(queryInterface, Sequelize) {
    // Revert by dropping the 'rajaongkir_cities' table
    await queryInterface.dropTable('rajaongkir_cities');

    // Recreate the 'cities' table if needed
    await queryInterface.createTable('cities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      postal_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true, // Adjust as needed
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
