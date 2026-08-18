const express = require("express");
const Report = require("../models/Report");
const Item = require("../models/Item");
const { protect } = require("../middleware/auth");

const router = express.Router();


// POST /api/reports
// Student reports an item
router.post("/", protect, async (req, res) => {
  try {
    const { itemId, reason } = req.body;

    if (!itemId || !reason) {
      return res.status(400).json({
        message: "Item ID and reason are required",
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // You cannot report your own post
    if (item.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot report your own post",
      });
    }

    const report = await Report.create({
      item: itemId,
      reportedBy: req.user._id,
      reason,
    });

    res.status(201).json(report);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to submit report",
    });
  }
});


// GET /api/reports
// Admin gets all reports
router.get("/", protect, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const reports = await Report.find({})
      .populate("item")
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(reports);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch reports",
    });
  }
});


// PATCH /api/reports/:id
// Admin resolves a report
router.patch("/:id", protect, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    report.status = "resolved";

    await report.save();

    res.json(report);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to resolve report",
    });
  }
});


module.exports = router;