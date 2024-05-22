const { Movie } = require("../models");

const createMovie = async (req, res) => {
  const { title, genre, year } = req.body;
  try {
    const movie = await Movie.create({ title, genre, year });
    res.status(201).json(movie);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating movie", error: error.message });
  }
};

const getMovies = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const movies = await Movie.findAndCountAll({
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    });
    res.json({
      totalPages: Math.ceil(movies.count / limit),
      currentPage: parseInt(page),
      movies: movies.rows,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching movies", error: error.message });
  }
};

module.exports = { createMovie, getMovies };
