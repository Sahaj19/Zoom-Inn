const { listingSchema, reviewSchema } = require("./SchemaValidation.js");
const ExpressError = require("./ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(server-side listing form validation)
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errorMsg = error.details[0].message;
    return next(new ExpressError(400, errorMsg));
  }
  next();
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(server-side review form validation)
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errorMsg = error.details[0].message;
    return next(new ExpressError(400, errorMsg));
  }
  next();
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(your should be logged in, in order to post listing/reviews)
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Log in first!");
    req.session.redirectUrl = req.originalUrl;
    return res.redirect("/login");
  }
  next();
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(redirecting to original url before signing in)
const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.url = req.session.redirectUrl;
  }
  next();
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(listings authorization)
const isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currentUser._id)) {
    return next(
      new ExpressError(400, "You are not the owner of this listing!")
    );
  }
  next();
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(reviews authorization)
const isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currentUser._id)) {
    return next(
      new ExpressError(400, "You are not the author of this review!")
    );
  }
  next();
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = {
  validateListing,
  validateReview,
  isLoggedIn,
  saveRedirectUrl,
  isOwner,
  isReviewAuthor,
};
