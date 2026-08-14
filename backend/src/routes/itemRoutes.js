const express = require("express");
const Item = require("../models/Item");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/items?type=lost&category=&location=&q=blue
router.get("/", async (req, res) => {
  const { type, category, location, q } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (location) filter.location = location;
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },       // "i" = case-insensitive
      { description: { $regex: q, $options: "i" } },
    ];
  }
  const items = await Item.find(filter).sort({ createdAt: -1 }); // newest first
  res.json(items);
});
// GET /api/items/my
router.get("/my", protect, async (req, res) => {
  try {
    const items = await Item.find({
      postedBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch your posts" });
  }
});

router.get("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
});

router.post("/", protect, async (req, res) => {
  const item = await Item.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json(item);
});

router.patch("/:id", protect, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  const isOwner = item.postedBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not allowed" });
  }
  Object.assign(item, req.body);
  await item.save();
  res.json(item);
});

router.delete("/:id", protect, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  const isOwner = item.postedBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not allowed" });
  }
  await item.deleteOne();
  res.json({ message: "Item deleted" });
});

module.exports = router;