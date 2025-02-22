import { useEffect, useState } from "react";
import { fetchTransactions } from "../../api/transactions";
import Pagination from "../Pagination/Pagination";
import Loader from "../Loader/Loader";
import SearchBar from "../SearchBar/SearchBar";
import "./TransactionsTable.css"; // Import CSS for styling

const TransactionsTable = ({ month }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5; // Show 5 transactions per page

  useEffect(() => {
    let isMounted = true;

    const getTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching transactions for: ${month}`);

        const response = await fetchTransactions(month);

        if (isMounted) {
          if (response && Array.isArray(response.transactions)) {
            setTransactions(response.transactions);
            setFilteredTransactions(response.transactions);
          } else {
            console.warn("Unexpected API response:", response);
            setTransactions([]);
            setFilteredTransactions([]);
          }
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
        if (isMounted) setError("Failed to load transactions.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    getTransactions();

    return () => {
      isMounted = false;
    };
  }, [month]);

  // 🔍 Filter transactions based on search query
  useEffect(() => {
    const filtered = transactions.filter((tx) =>
      tx.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, transactions]);

  // 📝 Pagination Logic
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  if (loading) return <Loader />;
  if (error) return <p className="error-message">{error}</p>;
  if (!transactions.length)
    return (
      <p className="no-transactions">No transactions available for {month}</p>
    );

  return (
    <div className="transactions-container">
      <h3 className="transactions-title">Transactions for {month}</h3>

      {/* Search Bar */}
      <SearchBar onSearch={setSearchQuery} />

      {/* Transactions Table */}
      <div className="table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Price ($)</th>
              <th>Description</th>
              <th>Category</th>
              <th>Sold</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((tx,index) => (
              <tr key={tx.id || index}>
                <td>{tx.id || index}</td>
                <td>
                  <img
                    src={tx.image || "https://via.placeholder.com/80"} // Default placeholder if image is missing
                    alt={tx.title || "No Image"}
                    className="product-image"
                  />
                </td>
                <td>{tx.title ?? "N/A"}</td>
                <td>${tx.price?.toFixed(2) ?? "0.00"}</td>
                <td className="truncate-text">{tx.description ?? "N/A"}</td>
                <td>{tx.category ?? "N/A"}</td>
                <td>{tx.sold ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default TransactionsTable;
