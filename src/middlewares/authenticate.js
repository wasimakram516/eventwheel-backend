const jwt = require("jsonwebtoken");
const env = require("../config/env");
const response = require("../utils/response");
const { User } = require("../models/user");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response(res, 401, "Access token is required.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwt.secret);

    // Check if user exists in MongoDB
    const user = await User.findById(decoded.id);
    if (!user) {
      return response(res, 403, "Logged-in user is not found. Please log in again.");
    }

    req.user = user; // Attach full user object to request
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    console.error("Invalid token:", err.message);
    return response(res, 403, "Invalid or expired access token.");
  }
};

module.exports = authenticate;
