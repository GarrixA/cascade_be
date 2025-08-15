"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "Organization",
      [
        {
          id: "11111111-1111-1111-1111-111111111111",
          organization_name: "cascade Org",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("Organization", null, {});
  },
};
