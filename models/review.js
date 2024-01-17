const mongoose = require("mongoose");
const { Schema } = mongoose;

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const reviewSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 1,
  },
  comment: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const Review = mongoose.model("Review", reviewSchema);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = Review;
