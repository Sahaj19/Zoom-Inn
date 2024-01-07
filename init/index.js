const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const { sampleListings } = require("./data.js");

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ZoomInn");
    console.log("ZoomInn connected successfully!");
  } catch (error) {
    console.log("ZoomInn failed to connect", error);
  }
}

main();

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
async function initialize() {
  try {
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    console.log("Listing inserted successfully!");
  } catch (error) {
    console.log("Listing insertion failed!");
  }
}

initialize();
