const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js")
//  SIGNUP+ SIGNUP LOGIC  

router.
   route("/signup")
  .get(userController.renderSignup)
  .post(
  wrapAsync(userController.signup)
);
// login form + login logic
router
  .route("/login")
  .get(userController.renderLoginForm )
  .post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

// LOGOUT 

router.get("/logout",userController.logout );

module.exports = router;