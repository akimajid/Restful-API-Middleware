const sequelize = require("../config/database");
const User = require("./user");
const Movie = require("./movie");

sequelize.sync({ force: true }).then(() => {
  console.log("Database & tables created!");
});

module.exports = { User, Movie };
