const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview } = require("../utils/middlewares.js");

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(review post route)
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(review edit route form)
router.get("/:reviewId/edit", async (req, res) => {
  const { id, reviewId } = req.params;
  const listing = await Listing.findById(id);
  const review = await Review.findById(reviewId);
  res.render("reviews/edit.ejs", { review, listing });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(review edit update route )
router.put(
  "/:reviewId",
  validateReview,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndUpdate(reviewId, {
      ...req.body.review,
    });
    res.redirect(`/listings/${id}`);
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(review delete route)
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    res.redirect(`/listings/${id}`);
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router;
