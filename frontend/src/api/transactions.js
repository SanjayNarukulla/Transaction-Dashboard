import axios from "axios";

const API_URL = "http://localhost:5000"; // Update if backend is deployed

// Generic function to handle API requests
const fetchData = async (endpoint, defaultValue = []) => {
  try {
    const { data } = await axios.get(`${API_URL}${endpoint}`);
    if (data) {
      return data;
    } else {
      console.warn(`Empty response from ${endpoint}`);
      return defaultValue;
    }
  } catch (error) {
    console.error(
      `Error fetching data from ${endpoint}:`,
      error.response?.data || error.message
    );
    return defaultValue;
  }
};

// Fetch Transactions
export const fetchTransactions = (month) =>
  fetchData(`/api/transactions?month=${month}`, []);

// Fetch Statistics
export const fetchStatistics = (month) =>
  fetchData(`/api/statistics?month=${month}`, {});

// Fetch Bar Chart Data
export const fetchBarChartData = (month) =>
  fetchData(`/api/barchart?month=${month}`, {});

// Fetch Pie Chart Data
export const fetchPieChartData = (month) =>
  fetchData(`/api/piechart?month=${month}`, {});
