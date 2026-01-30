if(process.env.NODE_ENV != "production"){
require('dotenv').config();

}


const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError");

// MODELS
const User = require("./models/user");

// ROUTES
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");

// ================= DATABASE =================
mongoose
  .connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================= VIEW ENGINE =================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ================= SESSION =================
const sessionOptions = {
  store: MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1:27017/wanderlust",
    touchAfter: 24 * 3600,
  }),
  secret: "thisisasecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= FLASH + CURRENT USER =================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // ✅ SAME variable
  next();
});

// ================= ROUTES =================
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// ================= HOME =================
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ================= ERROR HANDLING =================
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { err });
});

// ================= SERVER =================
app.listen(8060, () => {
  console.log("Serving on port 8060");
});