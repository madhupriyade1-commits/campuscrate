const express = require("express");
const Item = require("../models/Item");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// GET /api/items?type=lost&category=&location=&q=blue
// GET /api/items
// Supports search + type + category + location + status filters
router.get("/", async (req, res) => {
  try {
    const { type, category, location, status, q } = req.query;

    const filter = {};

    // Type filter: lost / found
    if (type) {
      filter.type = type;
    }

    // Status filter: active / claimed / returned
    if (status) {
      filter.status = status;
    }

    // Category: partial + case-insensitive
    if (category) {
      filter.category = {
        $regex: category,
        $options: "i",
      };
    }

    // Location: partial + case-insensitive
    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // General search
    // Searches title, description and tags
    if (q) {
      filter.$or = [
        {
          title: {
            $regex: q,
            $options: "i",
          },
        },
        {
          description: {
            $regex: q,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: q,
            $options: "i",
          },
        },
      ];
    }

    const items = await Item.find(filter).sort({
      createdAt: -1,
    });

    res.json(items);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch items",
    });
  }
  });

router.get("/my", protect, async (req, res) => {
  try {
    const items = await Item.find({
      postedBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch your posts",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch item",
    });
  }
});

router.post("/", protect, upload.single("photo"), async (req, res) => {
  try {
    let photoUrl = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "campuscrate",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(req.file.buffer);
      });

      photoUrl = result.secure_url;
    }

    const item = await Item.create({
      ...req.body,
      photoUrl,
      postedBy: req.user._id,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create item",
    });
  }
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