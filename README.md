
<img width="1536" height="1024" alt="ChatGPT Image Apr 13, 2026, 08_28_37 AM" src="https://github.com/user-attachments/assets/8f5ec637-4b00-4020-b0a1-17740f754361" />

Wanderlust is designed using a Monolithic MVC Architecture built on the MERN Stack, with clear separation between Controllers, Business Logic, and Data Layer. The system is optimized for performance and scalability using a Cache-First Strategy with Redis and enhanced search capabilities through Semantic Search with Vector Embeddings in MongoDB Atlas.

The architecture of the application is such to be **scalable and extensible**, supporting **location-based Services**, **advanced searching**, and **Semantic/Vector based searching**.

## Primary Architectural Components

• Semantic search through the use of vector embeddings
• Cache Layer (Redis)
• Client Layer (Browser)
• Express Server (Node.js Backend)
• Controller Layer -> (Listings, Authentication, Reviews)
• Database Layer - >(MongoDB)
• External Service - >(Mapbox API)


# Core Features

• Design a Resposive UI with EJS 
• Advanced Searching - **Location, Category, Price Filters**
• Flexible **Regex Based Location Searching**
• Passport.js was utilized for the authentication and authorization system
• Full CRUD functionality for both Listings and Reviews
• Used Redis as caching to improve performance
• Used Mapbox to provide geographical visualizations of data
• Implemented a filtering method that allows users to search for listings based on categories
• Performed server-side validation for incoming requests using Joi
•Followed a clean and scalable MVC design pattern throughout development


# System Flow
1. Client sends request to Express Server
1. Request is routed to the appropriate Controller
1. Controller calls Service Layer for business logic
1. Service Layer checks Redis Cache
1. If Cache Hit - Return Data Immediately
1. If Cache Miss - Request Data from MongoDB
1. Cache Retrieved Data in Redis Cache
1. Return Response to Client
1. Use Mapbox APIs for Geolocation / Map Rendering



## Secure Login
- User authentication with passport.js
- Login and logout implemented with session-based authentication
- Authorized users are the only ones who can modify their respective resources
- Input validation with Joi Schema Validator
- Centralized error handling through middleware


### Improving Performance
- Caching of frequently accessed routes has been implemented using Redis
- Cache-first strategy reduces the number of database queries per request
- Cache will be invalidated after any create, update, or delete actions occur
- This results in quicker response times and enhanced scalability



### Technology Used

Back-End Technologies:
Node.js
Express.js


Front-End Technologies:
 EJS
 HTML
CSS
Bootstrap


Database:
MongoDB with Mongoose


Caching Technology:
Redis


Authentication Technology:
Passport.js


Validation Technology:
Joi


Outside Services/Technologies:
Mapbox API

## Project Structure
/controllers
/models
/routes
/views
/public
/middle ware
/utils
/app.js






