const Item = require("../models/item");
const { processReview } = require("../utils/helper");

//fetch all items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({});
    res.status(200).send(items);
  } catch (error) {
    res.status(400).send(error);
  }
};
//fetch an item
const getItemById = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id });
    if (!item) {
      res.status(404).send({ error: "Item not found" });
    }
    res.status(200).send(item);
  } catch (error) {
    res.status(400).send(error);
  }
};

//create an item
const createItem = async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body,
      owner: req.user._id,
    });
    await newItem.save();
    res.status(201).send(newItem);
  } catch (error) {
    // console.log({ error });
    res.status(400).send({ message: "error" });
  }
};

//update an item

const updateItemById = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "description", "category", "price"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates" });
  }

  try {
    const item = await Item.findOne({ _id: req.params.id });

    if (!item) {
      return res.status(404).send();
    }

    updates.forEach((update) => (item[update] = req.body[update]));
    await item.save();
    res.send(item);
  } catch (error) {
    res.status(400).send(error);
  }
};

//delete item
const deleteItemById = async (req, res) => {
  try {
    const deletedItem = await Item.findOneAndDelete({ _id: req.params.id });
    if (!deletedItem) {
      res.status(404).send({ error: "Item not found" });
    }
    res.send(deletedItem);
  } catch (error) {
    res.status(400).send(error);
  }
};
const getItemReviews = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id });
    if (!item) {
      res.status(404).send({ error: "Item not found" });
    }
    const populatedItem = await item.populate("reviews");
    const result = await Promise.all(
      populatedItem.reviews.map(async (review) => {
        return await processReview(review);
      })
    );
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

module.exports = {
  getAllItems,
  getItemReviews,
  deleteItemById,
  updateItemById,
  createItem,
  getItemById,
};
