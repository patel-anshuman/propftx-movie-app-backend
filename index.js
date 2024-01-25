const express = require("express");
require("dotenv").config();

const port = process.env.PORT || 4000;
const { connection } = require("./config/db");

// Import routes
const userRoute = require("./routes/user.route");
const movieRoute = require("./routes/movie.route");

// Middleware
const cors = require("cors");

const app = express();

// Middleware setup
app.use(express.json()); // Parse incoming JSON data
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Define routes
app.use("/user", userRoute); // User-related routes
app.use("/movies", movieRoute); // Movie-related routes

// Start the server
app.listen(port, async () => {
  try {
    // Connect to MongoDB Atlas
    await connection;
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.log(error);
    console.log("Couldn't connect to MongoDB Atlas");
  }

  console.log("Listening at port:", port);
});
