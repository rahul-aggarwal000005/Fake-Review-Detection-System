const express = require("express");
const Auth = require("../middleware/auth");
const router = new express.Router();
const createReview = require("../controllers/reviewController");

router.post("/review", Auth, createReview);

module.exports = router;
