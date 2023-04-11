const express = require("express");
const Auth = require("../middleware/auth");
const {
  logout,
  login,
  signup,
  logoutAll,
} = require("../controllers/userController");

const router = new express.Router();
router.post("/users", signup);
router.post("/users/login", login);
router.post("/users/logout", Auth, logout);
router.post("/users/logoutAll", Auth, logoutAll);
module.exports = router;
