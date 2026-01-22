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
