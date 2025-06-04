const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const env = require("../config/env");

// Generate an access token (short-lived)
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.accessExpiry } // Short expiry (e.g., 15 min)
  );
};

// Generate a refresh token (long-lived)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    env.jwt.secret,
    { expiresIn: env.jwt.refreshExpiry } // Uses JWT_REFRESH_EXPIRY from .env (e.g., 7 days)
  );
};

// Hash user password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Verify password
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  verifyPassword,
  verifyToken
};
