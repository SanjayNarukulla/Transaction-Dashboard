import { useEffect, useState } from "react";
import { fetchStatistics } from "../../api/transactions";
import "./Statistics.css"; // ✅ Import the CSS file

const Statistics = ({ month }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const getStats = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching statistics for: ${month}`);
        const data = await fetchStatistics(month);

        if (isMounted) setStats(data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        if (isMounted) setError("Failed to load statistics.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getStats();

    return () => {
      isMounted = false;
    };
  }, [month]);

  if (loading)
    return <p className="statistics-container">Loading statistics...</p>;
  if (error) return <p className="statistics-container">{error}</p>;
  if (!stats)
    return (
      <p className="statistics-container">
        No statistics available for {month}
      </p>
    );

  return (
    <div className="statistics-container">
      <h3>Statistics</h3>
      <p>
        Total Sales: <span>${stats.totalSales?.toFixed(2) ?? "0.00"}</span>
      </p>
      <p>
        Sold Items: <span>{stats.soldItems ?? 0}</span>
      </p>
      <p>
        Not Sold Items: <span>{stats.notSoldItems ?? 0}</span>
      </p>
    </div>
  );
};

export default Statistics;
