const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema(
  {
    author: {
      type: ObjectID,
      required: true,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
