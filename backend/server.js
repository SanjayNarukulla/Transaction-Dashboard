const express = require("express");
const cors = require("cors");
const compression = require("compression");
const connectDB = require("./config/db");
const transactionRoutes = require("./routes/transactionRoutes");
require("dotenv").config();

const app = express();
connectDB();

// ✅ Security: Restrict CORS settings
app.use(
  cors({
    origin:  "https://transaction-dashboard-1-sj1k.onrender.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Performance: Enable compression
app.use(compression());

// ✅ Security: Limit JSON request size
app.use(express.json({ limit: "1mb" }));

// ✅ API Routes
app.use("/api", transactionRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
