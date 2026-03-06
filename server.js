require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const noteRoutes = require("./routes/notes");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Homepage route
app.get("/", (req, res) => {
  res.send("Cloud Notes App Backend Running");
});

// API Routes
app.use("/api/auth", authRoutes);   // 👈 Auth routes
app.use("/api/notes", noteRoutes);  // 👈 Notes routes

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});