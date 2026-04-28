const User = require("../models/user");
const passport = require("passport");

module.exports.renderSignup= (req, res) => {
  res.render("users/signup");
}

module.exports.signup = async (req, res,next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email });

      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

 module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs"); 
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to StayHaven!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};