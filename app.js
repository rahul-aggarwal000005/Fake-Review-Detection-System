const express = require("express");
const bodyParser = require("body-parser");
require("./db/mongoose");
const userRouter = require("./routers/userRouter");
const itemRouter = require("./routers/itemRouter");
const reviewRouter = require("./routers/reviewRouter");
const session = require("express-session");
const auth = require("./middleware/auth");
const app = express();
const axios = require("axios");
const nodeServer = process.env.NODE_SERVER;
const store = require("store2");
store.clearAll();

// Set up the view engine to use EJS
app.set("view engine", "ejs");
// Serve static files in the public directory
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set up session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use("/api", userRouter);
app.use("/api", itemRouter);
app.use("/api", reviewRouter);

// Check if the user is already logged in
function requireLogin(req, res, next) {
  if (store("token")) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/", (req, res) => {
  res.redirect("/home");
});
// Render the index page
app.get("/home", requireLogin, async (req, res) => {
  try {
    const endPoint = `${nodeServer}/api/items`;
    const response = await axios.get(endPoint, {
      headers: { authorization: `Bearer ${req.session.token}` },
    });
    products = response.data;
    res.render("home", { products: products });
  } catch (err) {
    console.log(err);
  }
});

app.get("/login", (req, res) => {
  console.log(store("token"));
  if (store("token")) {
    res.redirect("/home");
  } else {
    res.render("login");
  }
});

app.get("/product/:id", requireLogin, async (req, res) => {
  try {
    const id = req.params.id; // Get the product id from the request params
    let response = await axios.get(`${nodeServer}/api/items/${id}`);
    const productDetails = response.data;
    response = await axios.get(`${nodeServer}/api/item/reviews/${id}`);
    const productReviews = response.data;
    res.render("product", { product: productDetails, reviews: productReviews });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching product details");
  }
});

app.get("/utils", async (req, res) => {
  try {
    res.render("helper");
  } catch (error) {}
});

app.post("/addProduct", async (req, res) => {
  try {
    const body = { ...req.body, price: Number(req.body.price) };
    console.log(body);
    let response = await axios.post(`${nodeServer}/api/items`, body);
    console.log(response.data);
  } catch (error) {}
  res.redirect("/utils");
});

app.get("/logout", requireLogin, async (req, res) => {
  store.remove("token");
  res.redirect("/login");
});

app.get("/logoutAll", requireLogin, async (req, res) => {
  try {
    store.remove("token");
    res.redirect("/login");
  } catch (error) {
    res.status(500).send(error);
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
