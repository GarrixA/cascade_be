const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);
  return hashedPass;
};
("use strict");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "User",
      [
        {
          id: "7121d946-7265-45a1-9ce3-3da1789e657e",
          firstName: "prince",
          lastName: "Junior",
          email: "princejj@gmail.com",
          role: "11afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
          password: await hashPassword("longPassWORD123"),
          confirmPassword: await hashPassword("longPassWORD123"),
          isVerified: true,
          isPasswordExpired: false,
          // phone_number: null,
          // organization: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: "7ca39bd8-ab6c-42a7-a136-62357cbede3a",
          firstName: "Aphrodis",
          lastName: "Uwineza",
          email: "aphrodisu2019@gmail.com",
          role: "12afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
          password: await hashPassword("Morning12$"),
          confirmPassword: await hashPassword("Morning12$"),
          isVerified: true,
          isPasswordExpired: false,
          phone_number: "0780000002",
          // organization: null,
          // reply: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "6d21d946-7265-45a1-6ce3-3da1789e657e",
          firstName: "Garrix",
          lastName: "Sven",
          email: "garrixme@gmail.com",
          role: "13afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
          password: await hashPassword("Morning12$"),
          confirmPassword: await hashPassword("Morning12$"),
          isVerified: true,
          isPasswordExpired: false,
          phone_number: "0780000003",
          // organization: null,
          // reply: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
