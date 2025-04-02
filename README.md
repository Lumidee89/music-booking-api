music-booking-api

A RESTful API for managing music events, artist profiles, and booking transactions.

Features
Event listing and management
Artist profile management
Users and Admin authentication
Booking system for events
Secure payment processing


Tech Stack
Node.js with Express
MongoDB with Mongoose
JWT for authentication
Express Validator for input validation


Installation
Clone the repository:
git clone <repository-url>
cd music-booking-api
Install dependencies:
npm install
Create a .env file in the root directory and add your environment variables:
MONGODB_URI=mongodb+srv://musicbookingapi:musicbookingapi@cluster0.hgheisd.mongodb.net/
PORT=3000
JWT_SECRET=c5oNiKoG2m/W7D3WsHgQjrkUmimiA2rBs1dPuSoqJz8=
JWT_EXPIRE=30d
SMTP_HOST=mail.mailhives.com
SMTP_PORT=465
SMTP_USERNAME=info@mailhives.com
SMTP_PASSWORD=info@mailhives.com
FROM_EMAIL=info@mailhives.com
FROM_NAME=Music Booking App

Below is the link to the postman collection for the API:
https://documenter.getpostman.com/view/31305123/2sB2cRCPfi

Security
JWT-based authentication
Password hashing with bcrypt
Input validation and sanitization
CORS enabled
Helmet for security headers
