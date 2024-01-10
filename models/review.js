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
    require: true,
  },
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const Review = mongoose.model("Review", reviewSchema);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = Review;
