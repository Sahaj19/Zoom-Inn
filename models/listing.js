const mongoose = require("mongoose");
const { Schema } = mongoose;

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let defaultLink =
  "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const listingSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  image: {
    type: String,
    default: defaultLink,
    set: (v) => (v === "" ? defaultLink : v),
  },
  location: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const Listing = mongoose.model("Listing", listingSchema);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = Listing;
