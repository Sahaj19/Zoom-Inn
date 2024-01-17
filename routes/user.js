const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/WrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError.js");
const { saveRedirectUrl } = require("../utils/middlewares.js");

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(signup form)
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(post signup route)
router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ username, email });
      let registeredUser = await User.register(newUser, password);

      req.login(registeredUser, (error) => {
        if (error) {
          return next(new ExpressError(400, "Failed to login!"));
        }
        req.flash("success", `Welcome to Zoom-Inn ${username}`);
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(login form)
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(post login route)
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome to Zoom-Inn");
    let redirectUrl = res.locals.url || "/listings";
    res.redirect(redirectUrl);
  }
);

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//(logout route)
router.get("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(new ExpressError(400, "Failed to logout!"));
    }
    req.flash("success", "Logged you out successfully!");
    res.redirect("/listings");
  });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router;
