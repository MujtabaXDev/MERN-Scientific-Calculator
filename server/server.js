require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const historyRoutes = require("./routes/history");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/history", historyRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.get("/", (req, res) => {
  res.send("Server is working");
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.log(
      "Starting server without DB (history features will fail until MongoDB is available)...",
    );
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT} (no DB)`),
    );
  });
