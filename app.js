const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/userRouter");
const itemRouter = require("./routers/itemRouter");
const reviewRouter = require("./routers/reviewRouter");
const app = express();

// Set up the view engine to use EJS
app.set("view engine", "ejs");
// Serve static files in the public directory
app.use(express.static("public"));
app.use(express.json());
app.use("/api", userRouter);
app.use("/api", itemRouter);
app.use("/api", reviewRouter);

// Render the index page
app.get("/", (req, res) => {
  res.render("index", { title: "Hello", message: "Welcome to my app!" });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Listening on port " + port);
});
