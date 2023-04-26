const express = require("express");
const Auth = require("../middleware/auth");
const {
  logout,
  login,
  signup,
  logoutAll,
} = require("../controllers/userController");

const router = new express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", Auth, logout);
router.post("/logoutAll", Auth, logoutAll);
module.exports = router;
