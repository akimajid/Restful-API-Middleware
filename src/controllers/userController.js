const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const register = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error registering user", error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credential" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.SECRET_KEY
    );
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: "Login error", error: error.message });
  }
};

const getUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const users = await User.findAndCountAll({
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    });
    res.json({
      totalPages: Math.ceil(users.count / limit),
      currentPage: parseInt(page),
      users: users.rows,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching users", error: error.message });
  }
};

module.exports = { register, login, getUsers };
