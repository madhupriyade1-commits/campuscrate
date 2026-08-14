const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Checks that a request has a valid login token, and attaches the user to req.user
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization; // expects "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid/expired
    const user = await User.findById(decoded.id).select("-password"); // fetch user, exclude password field
    if (!user || user.blocked) {
      return res.status(403).json({ message: "Account not accessible" });
    }
    req.user = user; // now every later handler can read req.user
    next(); // continue to the actual route handler
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Must run AFTER protect — checks the already-attached user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { protect, isAdmin };