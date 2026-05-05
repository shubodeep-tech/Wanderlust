if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


if (!process.env.MONGO_URI) throw new Error("MONGO_URI env var not set!");
if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET env var not set!");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo").default;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const helmet = require("helmet");

const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://api.mapbox.com",
          "https://cdnjs.cloudflare.com",
          "'unsafe-inline'", // needed for Bootstrap & inline scripts
        ],
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://api.mapbox.com",
          "https://cdnjs.cloudflare.com",
          "'unsafe-inline'",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://res.cloudinary.com",
          "https://images.unsplash.com",
          "https://*.mapbox.com",
        ],
        connectSrc: [
          "'self'",
          "https://api.mapbox.com",
          "https://events.mapbox.com",
        ],
        workerSrc: ["blob:"],
        frameSrc: ["'none'"],
      },
    },
  })
);

// DB CONNECT 
const dbUrl = process.env.MONGO_URI;

mongoose.set("strictQuery", true);

mongoose
  .connect(dbUrl)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// VIEW ENGINE
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// STATIC FILES
app.use(express.static(path.join(__dirname, "public")));

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.error("Session store error:", err); 
});

app.use(
  session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",                            
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(flash());

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// GLOBAL LOCALS
app.use((req, res, next) => {
  res.locals.currUser = req.user || null;
  res.locals.success = req.flash("success") || [];
  res.locals.error = req.flash("error") || [];
  res.locals.query = req.query?.query || "";
  res.locals.category = req.query?.category || ""; // ✅ add this
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ROUTES
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const aiRoutes = require("./routes/ai");
const searchRoutes = require("./routes/search.routes");

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);
app.use("/ai", aiRoutes);
app.use("/search", searchRoutes);


app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? statusCode === 404
        ? "Page Not Found"
        : "Something went wrong. Please try again."
      : err.message || "Server Error";

  res.status(statusCode).render("error", { err: { message, statusCode } });
});

// SERVER
const PORT = process.env.PORT || 8060;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
