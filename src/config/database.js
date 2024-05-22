const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.SQL_DB_NAME,
  process.env.SQL_USERNAME,
  process.env.SQL_PASSWORD,
  {
    dialect: "postgres",
    logging: false,
  }
);

module.exports = sequelize;
