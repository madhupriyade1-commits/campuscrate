const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/users
// Get all users
router.get("/", protect, async (req, res) => {
  try {
    // Only admins can access route
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

// PATCH /api/users/:id
// Block or unblock a user
router.patch("/:id", protect, async (req, res) => {
  try {
    // Only admins can block/unblock users
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const { id } = req.params;
    const { blocked } = req.body;

    // Make sure blocked is actually a boolean
    if (typeof blocked !== "boolean") {
      return res.status(400).json({
        message: "Blocked value must be true or false",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent an admin from blocking themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot block yourself",
      });
    }

    user.blocked = blocked;

    await user.save();

    res.json({
      message: blocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        blocked: user.blocked,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update user status",
    });
  }
});

module.exports = router;