const User = require("../models/user");
const store = require("store2");
// const { getErrorMessage } = require("../utils/notificationMessage");

//signup
const signup = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    // console.log(error);
    res.status(400).send(error);
  }
};

//login
const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    req.session.isLoggedIn = true;
    req.session.token = token;
    store("token", token);
    return res.redirect("/home");
  } catch (error) {
    console.log("Invalid credentials");
    return res.redirect("/login");
  }
};

//logout
const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    req.session.token = null;
    req.session.isLoggedIn = false;
    store.remove("token");
    res.redirect("/login");
  } catch (error) {
    res.status(500).send();
  }
};

//Logout All
const logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    req.session.isLoggedIn = false;
    req.session.token = null;
    store.remove("token");
    res.redirect("/login");
  } catch (error) {
    res.status(500).send();
  }
};
module.exports = {
  logoutAll,
  logout,
  login,
  signup,
};
