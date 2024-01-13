const { listingSchema, reviewSchema } = require("./SchemaValidation.js");
const ExpressError = require("./ExpressError.js");

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
module.exports = { validateListing, validateReview };
