# AI Driven Travel Recommendation Engine

MERN stack project inspired AI intregrated

## Tech Stack
- Node.js
- Express
- MongoDB
- Mongoose


 Day 1 - Project Setup
- Project folder setup
- Express app setup
- MongoDB connection
- Listing model created
- Database initialization
- Git & GitHub setup

Day 2 – CRUD Operations

What I worked on
	•	Implemented CRUD operations
	•	Connected routes with controllers
	•	Tested basic functionality

⸻

CRUD Features

Create
	•	Add new data to database
	•	Form data saved successfully

Read
	•	Fetch all records
	•	View single record by ID

Update
	•	Edit existing data
	•	Changes reflected in database

Delete
	•	Remove data by ID
	•	Record deleted permanently

⸻

Files Updated
	•	listing/
	•	models/
	•	views/

Day 3 – UI Layout & Styling

Work Done
	•	Created a reusable main boilerplate layout using EJS
	•	Added reusable navbar and footer components
	•	Integrated Bootstrap for consistent UI styling
	•	Linked Google Font – Plus Jakarta Sans
	•	Applied global CSS for consistent typography and layout
	•	Designed listings index page using a card-based layout
	•	Styled new listing, edit listing, and show listing pages
	•	Ensured basic responsiveness across screen sizes

Concepts Used
	•	EJS layouts using ejs-mate
	•	EJS partials (navbar, footer)
	•	Bootstrap grid system
	•	Custom CSS styling
	•	Responsive design fundamentals

⸻

Day 4 – Error Handling & Validation

Progress
	•	Implemented both client-side and server-side validation
	•	Added user-friendly success and error feedback messages
	•	Built a centralized error handling mechanism
	•	Validated incoming request data using schema-based middleware

What I Worked On
	•	Implemented client-side form validation using Bootstrap validation feedback
	•	Handled invalid form submissions gracefully
	•	Created a custom ExpressError class for structured error handling
	•	Implemented global Express error-handling middleware
	•	Added schema-based validation middleware for request validation
	•	Returned meaningful and readable error messages to users

Concepts Used
	•	Custom Error Class (ExpressError)
	•	Express Error Handling Middleware
	•	Client-side Form Validation
	•	Server-side Schema Validation (Middleware)
	•	Centralized error handling flow
	•	Clean MVC-friendly error structure

Files Updated / Added
	•	utils/expressError.js
	•	utils/wrapAsync.js
	•	middleware/validation.js
	•	public/js/script.js
	•	app.js

⸻

Day 5 – Reviews & Mongoose Middleware

Progress
	•	Implemented Mongoose middleware
	•	Created a dedicated Review model
	•	Added client-side validation for reviews
	•	Integrated reviews with listings

What I Worked On
	•	Designed and implemented a Review schema and model using Mongoose
	•	Established one-to-many relationship between listings and reviews
	•	Linked reviews to listings using ObjectId references
	•	Used Mongoose pre/post middleware hooks for review-related logic
	•	Added client-side validation for review submissions
	•	Prevented invalid reviews from being submitted
	•	Strengthened error handling for review operations

Concepts Used
	•	Mongoose Schema & Model
	•	One-to-Many Relationships (Listing → Reviews)
	•	Mongoose Middleware (pre / post hooks)
	•	Client-side Validation
	•	Nested Express Routes
	•	Data integrity and validation flow

Files Updated / Added
	•	models/review.js
	•	models/listing.js
	•	public/js/script.js
	•	views/listings/show.ejs
	•	app.js (or related routes/controllers)

Day 6 – Reviews, Validation & Router Refactoring

What I worked on
	•	Implemented validation for review data using Joi schema
	•	Rendered reviews on listing show page
	•	Added UI styling for reviews section
	•	Implemented delete review functionality
	•	Added middleware for review validation and deletion handling
	•	Refactored routes using Express Router

⸻

Review Features
	•	Create review for a listing
	•	Display all reviews under a listing
	•	Validate review input before saving to database
	•	Delete review by review ID
	•	Remove review reference from listing using $pull

⸻

Validation & Middleware
	•	Used Joi to validate review data
	•	Created validateReview middleware
	•	Centralized error handling using custom ExpressError
	•	Prevented invalid data from reaching database

⸻

Routing Improvements
	•	Used express.Router() for cleaner code
	•	Separated listing routes and review routes
	•	Used mergeParams: true to access listing ID in reviews
	•	Reduced code duplication and improved maintainability

⸻

Files Updated
	•	routes/listing.js
	•	routes/reviews.js
	•	models/reviews.js
	•	schema.js
	•	views/listings/show.ejs
	•	public/css/style.css

⸻

Concepts Used
	•	Express Router
	•	Middleware chaining
	•	Joi validation
	•	Mongoose relations
	•	Error handling middleware
	•	RESTful routing

Key Learning
	•	Middleware helps control request flow
	•	Validation is required before database operations
	•	Route restructuring improves scalability
	•	Proper router usage avoids complex route bugs

Day 7 – Debugging, Error Handling & Sessions Basics

Issues Faced & Fixes (What I Learned)
	•	Cast to ObjectId error (new)
	•	Cause: Dynamic route /:id was placed before /new
	•	Fix: Always place static routes (/new, /:id/edit) before dynamic routes
	•	Learning: Express matches routes top to bottom
	•	Edit page showing “Page Not Found”
	•	Cause: Missing or wrongly ordered edit routes
	•	Fix: Added GET /:id/edit before GET /:id
	•	Learning: Route order is critical in Express
	•	EJS error: err is not defined
	•	Cause: Error object not passed to error.ejs
	•	Fix: Passed only message from error middleware
	•	Learning: EJS crashes if variables are not explicitly passed
	•	Server crash with app.all("*")
	•	Cause: Node 22 + Express no longer supports "*"
	•	Fix: Used app.use() for 404 handler
	•	Learning: Use future-safe Express patterns
	•	Review deletion bug
	•	Cause: Wrong variable name (REview vs Review)
	•	Fix: Corrected model import
	•	Learning: Case sensitivity matters in Node.js

⸻

Cookies (Basics)
	•	Cookies store small data in browser
	•	Sent automatically with every request
	•	Used for:
	•	Login tracking
	•	User preferences
	•	Not secure by default

⸻

Express Sessions
	•	Sessions store data on server
	•	Browser only stores a session ID
	•	Safer than cookies
	•	Used for:
	•	Authentication
	•	Flash messages
	•	User login state

⸻

Express-Session Important Options
	•	secret → signs session ID (must be strong)
	•	resave: false → avoids unnecessary saves
	•	saveUninitialized: true → creates session even if empty
	•	cookie.maxAge → session expiry time

⸻

Flash Messages (connect-flash)
	•	Flash messages are temporary messages
	•	Stored in session
	•	Automatically deleted after one request
	•	Used for:
	•	Success alerts
	•	Error messages

Example use:
	•	Listing added successfully
	•	Listing deleted
	•	Validation failed

⸻

res.locals (Very Important)
	•	res.locals makes data available to all EJS files
	•	Used for:
	•	Flash messages
	•	Current user
	•	Common variables

Example:
	•	res.locals.success
	•	res.locals.error

Learning:
	•	Avoid passing same data to every res.render()