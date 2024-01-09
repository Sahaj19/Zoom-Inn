const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");

//utilities
const { listingSchema } = require("./utils/SchemaValidation.js");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/WrapAsync.js");

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
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(server-side form validation)
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errorMsg = error.details[0].message;
    return res.send(errorMsg);
  }
  next();
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(home route)
app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(index route)
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(new route)
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(post route)
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(show route)
app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
      return next(new ExpressError(400, "Listing does not exist!"));
    }

    res.render("listings/show.ejs", { listing });
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(edit route)
app.get(
  "/listings/:id/edit",
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
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    await listing.save();
    res.redirect(`/listings/${id}`);
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(delete route)
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(id error handler)
app.use((err, req, res, next) => {
  if (err.message.includes("Cast to ObjectId")) {
    return next(new ExpressError(400, "Invalid Id"));
  }
  next(err);
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(wildcard error handler)
app.all("*", (req, res, next) => {
  return next(new ExpressError(404, "Page not found!"));
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(global error handler)
app.use((err, req, res, next) => {
  let { statusCode = 400, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.listen(3000, () => {
  console.log(`server is active on http:localhost:3000`);
});
