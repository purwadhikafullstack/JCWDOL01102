/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
import provinces from '../seeders/data/provinces.json';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'rajaongkir_provinces',
      provinces.map((province) => ({
        province_id: province.province_id,
        province_name: province.province,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('rajaongkir_provinces', null, {});
  },
};
