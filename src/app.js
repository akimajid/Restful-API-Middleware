const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const { userRoutes, movieRoutes } = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
app.use(bodyParser.json());

const logStream = fs.createWriteStream(
  path.join(__dirname, "logs", "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: logStream }));

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
