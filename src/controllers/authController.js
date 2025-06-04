const { User } = require("../models/user");
const response = require("../utils/response");
const asyncHandler = require("../middlewares/asyncHandler");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyPassword,
  verifyToken,
} = require("../utils/auth");
const validateRegisterDTO = require("../dto/auth/register.dto");
const validateLoginDTO = require("../dto/auth/login.dto");
const env = require("../config/env");

// ✅ Register User
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = validateRegisterDTO(req.body);

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) return response(res, 400, "User with this email already exists.");

  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  return response(res, 201, "User registered successfully", newUser);
});

// ✅ Login User (Supports "Remember Me" Feature)
const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = validateLoginDTO(req.body);

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return response(res, 400, "Invalid credentials.");

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) return response(res, 400, "Invalid credentials.");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // ✅ Set Refresh Token Expiry (7 days by default, 30 days if "Remember Me" is checked)
  const refreshExpiry = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // 30 days or 7 days

  // ✅ Store refresh token in HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.node_env.toLowerCase() === "production",
    sameSite: "Strict",
    maxAge: refreshExpiry,
  });

  return response(res, 200, "Login successful", { accessToken });
});

// ✅ Refresh Access Token (Uses Refresh Token from HTTP-Only Cookie)
const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return response(res, 403, "Refresh token is missing.");

  // ✅ Verify Refresh Token
  const decoded = verifyToken(refreshToken);
  if (!decoded) return response(res, 403, "Refresh token expired. Please log in again.");

  const user = await User.findById(decoded.id);
  if (!user) return response(res, 403, "User not found.");

  const newAccessToken = generateAccessToken(user);

  return response(res, 200, "Token refreshed", { accessToken: newAccessToken });
});

// ✅ Logout User (Clears Refresh Token Cookie)
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "Strict" });

  return response(res, 200, "Logged out successfully");
});

// ✅ Export Functions
module.exports = { register, login, refreshToken, logout };
