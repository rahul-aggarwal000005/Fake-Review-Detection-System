const request = require("request");
const processReview = async (review) => {
  const populatedReview = await review.populate("author");
  return {
    name: populatedReview.author.name,
    email: populatedReview.author.email,
    review: review.reviewText,
    createdTime: populatedReview.createdAt,
  };
};

const getPrediction = async (review) => {
  const options = {
    url: "http://127.0.0.1:5000/predict",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      review: review,
    }),
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};

const predict = async (review) => {
  try {
    const result = await getPrediction(review);
    const isFake = JSON.parse(result)["isFake"];
    return isFake != null ? isFake : false;
  } catch (error) {
    console.error(error);
  }
};
module.exports = { processReview, predict };
