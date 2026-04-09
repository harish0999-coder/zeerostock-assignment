import { useState } from "react";

function FilterForm({ categories, onSearch }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ q, category, minPrice, maxPrice });
  };

  const handleReset = () => {
    setQ("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    onSearch({ q: "", category: "", minPrice: "", maxPrice: "" });
  };

  return (
    <form className="filter-form" onSubmit={handleSubmit}>
      <div className="filter-grid">
        <div className="filter-field">
          <label htmlFor="q">Product name</label>
          <input
            id="q"
            type="text"
            placeholder="e.g. keyboard, chair..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="filter-field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="minPrice">Min price ($)</label>
          <input
            id="minPrice"
            type="number"
            min="0"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="filter-field">
          <label htmlFor="maxPrice">Max price ($)</label>
          <input
            id="maxPrice"
            type="number"
            min="0"
            placeholder="Any"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
      <div className="filter-actions">
        <button type="submit" className="btn-primary">Search</button>
        <button type="button" className="btn-secondary" onClick={handleReset}>Reset</button>
      </div>
    </form>
  );
}

export default FilterForm;
