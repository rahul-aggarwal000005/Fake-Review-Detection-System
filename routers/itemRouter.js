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
router.post("/items", Auth, createItem);
router.patch("/items/:id", Auth, updateItemById);
router.delete("/items/:id", Auth, deleteItemById);
router.get("/item/reviews/:id", Auth, getItemReviews);
module.exports = router;
