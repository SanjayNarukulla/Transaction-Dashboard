import { useEffect, useState, useMemo } from "react";
import { fetchPieChartData } from "../../api/transactions";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import "./PieChart.css"; // ✅ Import the CSS file

// Register required components
Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({ month }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getData = async () => {
      try {
        setLoading(true);
        console.log(`Fetching pie chart data for: ${month}`);

        const data = await fetchPieChartData(month);
        if (isMounted) {
          setChartData(data);
        }
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getData();

    return () => {
      isMounted = false;
    };
  }, [month]);

  // **Dynamically generate colors based on dataset size**
  const generateColors = (size) =>
    Array.from(
      { length: size },
      () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    );

  // **Memoize Chart Data to prevent unnecessary re-renders**
  const pieData = useMemo(() => {
    if (!chartData || Object.keys(chartData).length === 0) return null;

    return {
      labels: Object.keys(chartData),
      datasets: [
        {
          data: Object.values(chartData),
          backgroundColor: generateColors(Object.keys(chartData).length),
        },
      ],
    };
  }, [chartData]);

  // **Chart Options (Memoized)**
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "right" },
        tooltip: { enabled: true },
      },
    }),
    []
  );

  if (loading) return <p>Loading chart...</p>;
  if (!pieData) return <p>No data available for {month}</p>;

  return (
    <div className="pie-chart-container">
      <h3>Category Distribution (Pie)</h3>
      <div className="pie-chart-wrapper">
        <Pie data={pieData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PieChart;
