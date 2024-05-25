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

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    let user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

module.exports = { register, login, getUsers, deleteUser, updateUser };
