require("dotenv").config(); // loads .env values into process.env — must be the very first line
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

connectDB(); // connect to MongoDB when the server starts

app.use(cors());          // allow requests from other origins (your React app)
app.use(express.json());  // automatically parse incoming JSON request bodies into req.body

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// (more routes get mounted here as you build them, e.g.:)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/claims", require("./routes/claimRoutes"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
