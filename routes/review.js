const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn } = require("../utils/middlewares.js");

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(review post route)
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "Review posted successfully!");
    res.redirect(`/listings/${id}`);
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(review edit route form)
router.get("/:reviewId/edit", isLoggedIn, async (req, res) => {
  const { id, reviewId } = req.params;
  const listing = await Listing.findById(id);
  const review = await Review.findById(reviewId);
  res.render("reviews/edit.ejs", { review, listing });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(review edit update route )
router.put(
  "/:reviewId",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndUpdate(reviewId, {
      ...req.body.review,
    });
    req.flash("success", "Review updated successfully!");
    res.redirect(`/listings/${id}`);
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(review delete route)
router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router;
