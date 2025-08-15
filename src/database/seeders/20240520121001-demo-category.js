"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          id: "22222222-2222-2222-2222-222222222222",
          categoryName: "Food Quality",
          // organizationId: "11111111-1111-1111-1111-111111111111",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
