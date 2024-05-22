const express = require("express");
const { createMovie, getMovies } = require("../controllers/movieController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/", auth, createMovie);
router.get("/", auth, getMovies);

module.exports = router;
