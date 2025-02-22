const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// Use POST instead of GET for database initialization
router.post("/initialize", transactionController.initializeDatabase);

// Transactions API with improved pagination
router.get("/transactions", transactionController.getTransactions);

// Statistics API with input validation
router.get("/statistics", transactionController.getStatistics);
router.get("/barchart", transactionController.getBarChartData);
router.get("/piechart", transactionController.getPieChartData);
router.get("/combined", transactionController.getCombinedData);

module.exports = router;
