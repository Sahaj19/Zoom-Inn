const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");

//routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");

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
//(home route)
app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(routing)
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

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
