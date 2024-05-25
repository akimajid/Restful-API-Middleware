const express = require("express");
const {
  register,
  login,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", auth, getUsers);
router.put("/users/:id", auth, updateUser);
router.delete("/users/:id", auth, deleteUser);

module.exports = router;
