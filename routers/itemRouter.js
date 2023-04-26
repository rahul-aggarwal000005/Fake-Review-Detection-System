const express = require("express");
const Auth = require("../middleware/auth");
const router = new express.Router();
const {
  getAllItems,
  getItemReviews,
  deleteItemById,
  updateItemById,
  createItem,
  getItemById,
} = require("../controllers/itemController");
router.get("/items", Auth, getAllItems);
router.get("/items/:id", Auth, getItemById);
router.post("/items", createItem);
router.patch("/items/:id", updateItemById);
router.delete("/items/:id", deleteItemById);
router.get("/item/reviews/:id", getItemReviews);
module.exports = router;
