const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js");
const port = 3000;

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(mongo configurations)
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
//(prerequisites)
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(home route)
app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(index route)
app.get("/listings", async (req, res) => {
  let allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(show route)
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.listen(port, () => {
  console.log(`server is active on http:localhost:${port}`);
});
