import React, { useState } from "react";
import "./SearchBar.css"; // ✅ Import the CSS file

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search transactions..."
      value={query}
      onChange={handleSearch}
      className="search-bar"
    />
  );
};

export default SearchBar;
