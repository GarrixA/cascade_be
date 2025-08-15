require("dotenv").config();

let dialect_option = {};

if (process.env.DB_HOSTED_MODE === "local") {
  dialect_option = {};
} else {
  dialect_option = {
    ssl: {
      require: process.env.SSL === "true",
      rejectUnauthorized: process.env.SSL === "false" ? false : true,
    },
  };
}

module.exports = {
  development: {
    url: process.env.DB_DEV_URL,
    dialectOptions: dialect_option,
  },
  test: {
    url: process.env.DB_TEST_URL,
    dialectOptions: dialect_option,
  },
  production: {
    url: process.env.DB_PROD_URL,
    dialectOptions: dialect_option,
  },
};
