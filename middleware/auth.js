const jwt = require("jsonwebtoken");
const User = require("../models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const store = require("store2");
// Define the local authentication strategy
passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize the user ID to the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize the user ID from the session and get the user object
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
const auth = async (req, res, next) => {
  try {
    const token = store("token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      return res.redirect("/login");
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Authentication required" });
  }
};

// Define the auth middleware to check if the user is authenticated
const passportAuth = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};

module.exports = auth;
