AI Powered Travel Recommendation Engine

MERN stack project inspired AI intregrated

## Tech Stack
- Node.js
- Express
- MongoDB
- Mongoose


 Day 1 - Project Setup:

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

What I Worked On:
	•	Implemented client-side form validation using Bootstrap validation feedback
	•	Handled invalid form submissions gracefully
	•	Created a custom ExpressError class for structured error handling
	•	Implemented global Express error-handling middleware
	•	Added schema-based validation middleware for request validation
	•	Returned meaningful and readable error messages to users

Concepts Used:
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



Day 8 – Authentication (Signup & Login)

What I Worked On
	•	Implemented user authentication system
	•	Created User model using Passport-Local-Mongoose
	•	Configured Passport local strategy
	•	Implemented Signup and Login functionality
	•	Tested authentication flow with demo users

⸻

Features Implemented

User Model
	•	Created User schema with username and email
	•	Integrated passport-local-mongoose
	•	Password hashing and salting handled automatically
	•	Added authentication-related methods to User model

Passport Configuration
	•	Configured Passport local strategy
	•	Initialized Passport and session handling
	•	Connected Passport with Express sessions
	•	Implemented serializeUser and deserializeUser

Signup (Register User)
	•	GET route to render signup form
	•	POST route to register new users
	•	Used User.register() for secure user creation
	•	Handled duplicate user and validation errors
	•	Redirected user after successful signup

Login
	•	GET route to render login form
	•	POST route to authenticate user
	•	Used Passport authenticate() middleware
	•	Managed login success and failure messages
	•	Created demo login user for testing

⸻

Concepts Learned
	•	Authentication vs Authorization
	•	Passport.js basics
	•	Passport-Local strategy
	•	Password hashing and security
	•	Session-based authentication
	•	How login and signup flow works in backend
	•	Error handling in authentication

⸻

Files/Modules Used
	•	passport
	•	passport-local
	•	passport-local-mongoose
	•	express-session
	•	connect-flash
	•	User model
	•	Auth routes (signup, login)

⸻

Outcome
	•	Secure signup and login system implemented
	•	User authentication working with sessions
	•	Ready to add authorization and protected routes next


Day 9 – Authorization (Listings & Reviews)

📌 Project Phase

Sigma 5 – Development
Project – Phase 2 (Part e)

⸻

🔐 Topic: Authorization Implementation

On Day 9, the focus was on implementing authorization in the application to ensure that only permitted users can perform sensitive actions like editing or deleting listings and reviews.

This step strengthens security, ownership control, and real-world correctness of the application.

⸻

🎯 Features Implemented

✅ Authentication Flow
	•	Login route connected
	•	Logout functionality added
	•	Automatic login after signup
	•	Post-login redirection handling
	•	UI styling for auth pages

⸻

✅ Listing Authorization
	•	Each listing is associated with an owner
	•	Only the listing owner can:
	•	Edit a listing
	•	Delete a listing
	•	Unauthorized users are blocked with proper feedback

⸻

✅ Review Authorization (Added)
	•	Each review is associated with an author
	•	Only the review author can:
	•	Delete their review
	•	Prevents misuse and unauthorized data modification

⸻

🧠 Key Concepts Covered
	•	Difference between authentication vs authorization
	•	Ownership-based access control
	•	Route protection using middleware
	•	Secure handling of user permissions
	•	Flash messages for better UX

⸻

🛠️ Tech Stack Used
	•	Node.js
	•	Express.js
	•	MongoDB & Mongoose
	•	Passport.js (Authentication)
	•	EJS Templates
	•	Connect-Flash

⸻

🔒 Security Improvements
	•	Protected routes from unauthorized access
	•	Ensured data integrity for listings and reviews
	•	Followed real-world backend authorization practices

⸻

📈 Learning Outcome
	•	Learned how large applications enforce user permissions
	•	Implemented scalable authorization logic
	•	Improved backend structure using reusable middleware
	•	Built production-ready access control patterns

⸻

✅ Status

✔ Login & Logout completed
✔ Listing ownership enforced
✔ Review authorization implemented
✔ Fully functional and tested

