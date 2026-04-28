if (process.env.NODE_ENV !== "production")
   {
   require("dotenv").config();
   } 
  
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const MongoStore = require("connect-mongo").default;
mongoose.set("strictQuery", true);

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");
const aiRoutes = require("./routes/ai");

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(console.log);

// ================= VIEW ENGINE =================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());




const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  cryto :{
    secret :process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error" ,() =>{
  console.log("ERROR in MONGO SESSION STORE",err)
})

app.use(
  session({
    store: store,
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(flash());

// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= LOCALS =================
app.use((req, res, next) => {
  res.locals.currUser = req.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.query = "";
  next();
});


// ================= ROUTES =================
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const searchRoutes = require("./routes/search.routes");

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.use("/ai", aiRoutes);


// ================= ERROR HANDLING =================
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).render("error", { err });
});



// ================= SERVER =================
app.listen(8060, () => {
  console.log("Serving on port 8060");
});