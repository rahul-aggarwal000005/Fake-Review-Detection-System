const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const itemSchema = new mongoose.Schema(
  {
    userReviewed: [
      {
        type: ObjectID,
        ref: "User",
      },
    ],
    reviews: [
      {
        type: ObjectID,
        ref: "Review",
      },
    ],
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
