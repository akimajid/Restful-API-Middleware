const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authMiddleware = require('./src/middlewares/auth');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
