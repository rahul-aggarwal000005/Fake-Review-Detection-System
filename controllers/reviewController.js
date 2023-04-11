const Review = require("../models/review");
const Item = require("../models/item");
const { predict } = require("../utils/helper");

const createReview = async (req, res) => {
  const owner = req.user._id;
  const { itemId, review } = req.body;

  try {
    const predictResp = predict(review);

    if (predictResp) {
      return res.status(404).send({ message: "Do not add the fake review" });
    }
    const item = await Item.findOne({ _id: itemId });
    if (!item) {
      res.status(404).send({ message: "item not found" });
      return;
    }
    if (item.userReviewed.includes(owner)) {
      return res.status(404).send({ message: "user already reviewed" });
    }

    const newReview = new Review({ author: owner, reviewText: review });
    const response = await predict(review);
    console.log(response);
    if (response) {
      return res
        .status(204)
        .json({ isFake: response, message: "Do not add reviews." });
    }
    await newReview.save();
    item.reviews.push(newReview._id);
    item.userReviewed.push(owner);
    await item.save();
    res.status(201).json({
      review,
      message: "Review created successfully",
      isFake: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

module.exports = createReview;
