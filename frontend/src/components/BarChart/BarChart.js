import { useEffect, useState } from "react";
import { fetchBarChartData } from "../../api/transactions";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./BarChart.css"; // ✅ Import the CSS file

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ month }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getData = async () => {
      setLoading(true);
      setChartData(null); // Clear data before fetching new data

      try {
        console.log(`Fetching data for: ${month}`);
        const data = await fetchBarChartData(month);

        if (isMounted) {
          setChartData({
            labels: Object.keys(data),
            datasets: [
              {
                label: "Transactions",
                data: Object.values(data),
                backgroundColor: "#4CAF50", // Green bars
                borderRadius: 5, // Rounded bars
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getData();

    return () => {
      isMounted = false;
    };
  }, [month]);

  if (loading) return <p>Loading chart...</p>;
  if (!chartData || chartData.labels.length === 0)
    return <p>No data available for {month}</p>;

  return (
    <div className="bar-chart-container">
      <h3>Price Range Distribution (Bar)</h3>
      <Bar key={month} data={chartData} />
    </div>
  );
};

export default BarChart;
