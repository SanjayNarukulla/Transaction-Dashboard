const axios = require("axios");
const Transaction = require("../models/transaction");
require("dotenv").config();

// **Initialize Database**
exports.initializeDatabase = async (req, res) => {
  try {
    console.log("Fetching data from API...");

    if (!process.env.API_URL) {
      return res
        .status(500)
        .json({ error: "API_URL is not set in the environment variables." });
    }

    const response = await axios.get(process.env.API_URL);

    if (!response.data || !Array.isArray(response.data)) {
      return res
        .status(500)
        .json({ error: "Invalid API response. Expected an array." });
    }

    console.log(`Fetched ${response.data.length} records from API.`);

    await Transaction.deleteMany(); // Clear existing transactions
    await Transaction.insertMany(response.data);

    console.log("✅ Database initialized successfully.");
    res.status(200).json({ message: "Database initialized successfully" });
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    res.status(500).json({ error: "Failed to initialize database" });
  }
};

// **Get Transactions**
exports.getTransactions = async (req, res) => {
  try {
    const { month, search } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1;
    if (isNaN(monthNumber)) {
      return res.status(400).json({ error: "Invalid month provided." });
    }

    const query = { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } };

    if (search) {
      const numericSearch = !isNaN(search) ? parseFloat(search) : null;
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
      if (numericSearch !== null) {
        query.$or.push({ price: numericSearch });
      }
    }

    console.log("🔍 Query:", JSON.stringify(query, null, 2));

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    // Get total count for pagination UI
    const total = await Transaction.countDocuments(query);

    // Fetch transactions with sorting & pagination
    const transactions = await Transaction.find(query)
      .sort({ dateOfSale: -1 }) // Sort by latest date
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({ transactions, total, page, perPage });
  } catch (error) {
    console.error("❌ Error fetching transactions:", error.message);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// **Get Statistics**
exports.getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1;

    const statistics = await Transaction.aggregate([
      { $match: { $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] } } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $cond: ["$sold", "$price", 0] } },
          soldItems: { $sum: { $cond: ["$sold", 1, 0] } },
          notSoldItems: { $sum: { $cond: ["$sold", 0, 1] } },
        },
      },
    ]);

    res.json(
      statistics.length > 0
        ? statistics[0]
        : { totalSales: 0, soldItems: 0, notSoldItems: 0 }
    );
  } catch (error) {
    console.error("❌ Error fetching statistics:", error);
    res.status(500).json({ error: "Error fetching statistics" });
  }
};

// **Get Bar Chart Data**
exports.getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1;

    const transactions = await Transaction.find({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
    });

    const priceRanges = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401-500": 0,
      "501-600": 0,
      "601-700": 0,
      "701-800": 0,
      "801-900": 0,
      "901-above": 0,
    };

    transactions.forEach(({ price }) => {
      const range = Math.min(Math.floor(price / 100) * 100, 900);
      priceRanges[`${range}-${range + 100}`] =
        (priceRanges[`${range}-${range + 100}`] || 0) + 1;
    });

    res.json(priceRanges);
  } catch (error) {
    console.error("❌ Error fetching bar chart data:", error.message);
    res.status(500).json({ error: "Error fetching bar chart data" });
  }
};

// **Get Pie Chart Data**
exports.getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1;

    const transactions = await Transaction.find({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
    });

    const categoryCounts = transactions.reduce((acc, tx) => {
      if (tx.category) {
        acc[tx.category] = (acc[tx.category] || 0) + 1;
      }
      return acc;
    }, {});

    res.json(categoryCounts);
  } catch (error) {
    console.error("❌ Error fetching pie chart data:", error.message);
    res.status(500).json({ error: "Error fetching pie chart data" });
  }
};

// **Get Combined Data**
exports.getCombinedData = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1;

    // ✅ Fetch transactions for the given month
    const transactions = await Transaction.find({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
    });

    // ✅ Calculate statistics
    const statistics = {
      totalSales: transactions.reduce(
        (sum, tx) => sum + (tx.sold ? tx.price : 0),
        0
      ),
      soldItems: transactions.filter((tx) => tx.sold).length,
      notSoldItems:
        transactions.length - transactions.filter((tx) => tx.sold).length,
    };

    // ✅ Fetch bar chart data
    const priceRanges = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401-500": 0,
      "501-600": 0,
      "601-700": 0,
      "701-800": 0,
      "801-900": 0,
      "901-above": 0,
    };

    transactions.forEach(({ price }) => {
      const range = Math.min(Math.floor(price / 100) * 100, 900);
      priceRanges[`${range}-${range + 100}`] =
        (priceRanges[`${range}-${range + 100}`] || 0) + 1;
    });

    // ✅ Fetch pie chart data (category-based distribution)
    const categoryCounts = transactions.reduce((acc, tx) => {
      if (tx.category) {
        acc[tx.category] = (acc[tx.category] || 0) + 1;
      }
      return acc;
    }, {});

    // ✅ Send combined response
    res.json({ statistics, barChart: priceRanges, pieChart: categoryCounts });
  } catch (error) {
    console.error("❌ Error fetching combined data:", error.message);
    res.status(500).json({ error: "Error fetching combined data" });
  }
};
