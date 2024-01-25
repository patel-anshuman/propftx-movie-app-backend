const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user.model");
require("dotenv").config();

// Middleware to authenticate incoming requests
const authenticate = async (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization.split(" ")[1];

  // Check if a token is provided
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token using the JWT_SECRET_KEY
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { userID } = decoded;

    // Find the user in the database using the decoded user ID
    const user = await userModel.findById(userID);

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach additional information to the request for later use
    req.body.customerName = decoded.name;
    req.body.client = decoded.userID;
    req.user = user;

    console.log(req.user); // Log user details for debugging
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Handle JWT verification errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.error(err); // Log other errors for debugging
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { authenticate };
