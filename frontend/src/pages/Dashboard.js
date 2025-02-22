import { useState, useCallback, useMemo } from "react";
import TransactionsTable from "../components/TransactionTable/TransactionsTable";
import Statistics from "../components/Statistics/Statistics";
import BarChart from "../components/BarChart/BarChart";
import PieChart from "../components/PieChart/PieChart";
import "./Dashboard.css"; // ✅ Import the CSS file

const Dashboard = () => {
  const [month, setMonth] = useState("March");

  // Prevent unnecessary re-renders
  const handleMonthChange = useCallback((e) => {
    setMonth(e.target.value);
  }, []);

  // ✅ Memoize Statistics and Charts to prevent re-renders
  const memoizedStatistics = useMemo(
    () => <Statistics month={month} />,
    [month]
  );
  const memoizedBarChart = useMemo(() => <BarChart month={month} />, [month]);
  const memoizedPieChart = useMemo(() => <PieChart month={month} />, [month]);

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      {/* Month Selection */}
      <div className="month-selector">
        <label htmlFor="month-select">Select Month:</label>
        <select id="month-select" value={month} onChange={handleMonthChange}>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      {/* Transactions Table */}
      <TransactionsTable month={month} />

      {/* Statistics Section */}
      {memoizedStatistics}

      {/* Charts Section */}
      <div className="charts">
        {memoizedBarChart}
        {memoizedPieChart}
      </div>
    </div>
  );
};

export default Dashboard;
