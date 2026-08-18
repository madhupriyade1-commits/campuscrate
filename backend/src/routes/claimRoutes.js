const express = require("express");
const Claim = require("../models/Claim");
const Item = require("../models/Item");
const { protect } = require("../middleware/auth");

const router = express.Router();

// POST /api/claims
// Submit a claim for an item
router.post("/", protect, async (req, res) => {
  try {
    const { itemId, answer } = req.body;

    if (!itemId || !answer) {
      return res.status(400).json({
        message: "Item ID and answer are required",
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // Cannot claim an already claimed or returned item
    if (item.status === "claimed" || item.status === "returned") {
      return res.status(400).json({
        message: "This item is no longer available for claims",
      });
    }

    // Cannot claim your own post
    if (item.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot claim your own item",
      });
    }

    // Check if this user has already claimed this item
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimant: req.user._id,
    });

    if (existingClaim) {
      return res.status(400).json({
        message: "You have already submitted a claim for this item",
      });
    }

    const claim = await Claim.create({
      item: itemId,
      claimant: req.user._id,
      answer,
    });

    res.status(201).json(claim);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to submit claim",
    });
  }
});

// GET /api/claims/my
// Get claims submitted by logged-in user
router.get("/my", protect, async (req, res) => {
  try {
    const claims = await Claim.find({
      claimant: req.user._id,
    })
      .populate("item")
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch your claims",
    });
  }
});

// GET /api/claims/received
// Get claims made on items posted by logged-in user
router.get("/received", protect, async (req, res) => {
  try {
    const items = await Item.find({
      postedBy: req.user._id,
    }).select("_id");

    const itemIds = items.map((item) => item._id);

    const claims = await Claim.find({
      item: { $in: itemIds },
    })
      .populate("item")
      .populate("claimant", "name email")
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch received claims",
    });
  }
});

// PATCH /api/claims/:id
// Approve or reject a claim
router.patch("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected",
      });
    }

    const claim = await Claim.findById(req.params.id).populate("item");

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found",
      });
    }

    // Only the person who posted the item can approve/reject
    if (
      claim.item.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the item owner can approve or reject this claim",
      });
    }

    // Update claim status
    claim.status = status;
    await claim.save();

    // Update item status
    if (status === "approved") {
      claim.item.status = "claimed";
      await claim.item.save();
    }

    if (status === "rejected") {
      claim.item.status = "active";
      await claim.item.save();
    }

    // Return updated claim
    const updatedClaim = await Claim.findById(claim._id)
      .populate("item")
      .populate("claimant", "name email");

    res.json(updatedClaim);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update claim",
    });
  }
});

module.exports = router;