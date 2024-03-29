const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const {
  validateListing,
  isLoggedIn,
  isOwner,
} = require("../utils/middlewares.js");

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(mapbox configurations)
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(index route)
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(new route)
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(post route)
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();

    req.flash("success", "New Listng created successfully!");
    res.redirect("/listings");
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(show route)
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");

    if (!listing) {
      return next(new ExpressError(400, "Listing does not exist!"));
    }

    res.render("listings/show.ejs", { listing });
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(edit route)
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
      return next(new ExpressError(400, "Listing does not exist!"));
    }

    res.render("listings/edit.ejs", { listing });
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(update route)
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    await listing.save();
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(delete route)
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router;
