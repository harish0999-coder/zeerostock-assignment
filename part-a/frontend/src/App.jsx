import { useState, useEffect } from "react";
import FilterForm from "./components/FilterForm";
import ProductTable from "./components/ProductTable";
import "./App.css";

https://zeerostock-assignment-1-eo6u.onrender.com;

function App() {
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  // Fetch available categories on mount
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));

    // Load all products initially
    handleSearch({ q: "", category: "", minPrice: "", maxPrice: "" });
  }, []);

  const handleSearch = async (filters) => {
    setLoading(true);
    setError("");
    setSearched(true);

    const params = new URLSearchParams();
    if (filters.q) params.append("q", filters.q);
    if (filters.category) params.append("category", filters.category);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

    try {
      const res = await fetch(`${API_BASE}/search?${params.toString()}`);
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "An error occurred.");
        setResults([]);
      } else {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      setError("Could not connect to the server. Make sure the backend is running.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <h1>Zeerostock</h1>
          <p>Search surplus inventory from multiple suppliers</p>
        </div>
      </header>

      <main className="app-main">
        <FilterForm categories={categories} onSearch={handleSearch} />

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
            <p>Searching inventory...</p>
          </div>
        ) : (
          <ProductTable results={results} searched={searched} />
        )}
      </main>
    </div>
  );
}

export default App;
