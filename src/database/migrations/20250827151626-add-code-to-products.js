"use strict";

// Helper function to generate 5-character alphanumeric codes
function generateCode(length = 5) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add column temporarily allowing null
    await queryInterface.addColumn("Products", "code", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    // Fetch existing products
    const products = await queryInterface.sequelize.query(
      `SELECT id FROM "Products";`
    );

    for (const p of products[0]) {
      let unique = false;
      let newCode = "";
      // Ensure uniqueness
      while (!unique) {
        newCode = generateCode();
        const [existing] = await queryInterface.sequelize.query(
          `SELECT id FROM "Products" WHERE code='${newCode}'`
        );
        if (existing.length === 0) unique = true;
      }

      await queryInterface.bulkUpdate(
        "Products",
        { code: newCode },
        { id: p.id }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Products", "code");
  },
};
