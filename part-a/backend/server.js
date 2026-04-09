const express = require("express");
const cors = require("cors");
const inventory = require("./data/inventory.json");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// GET /search
// Query params: q (product name partial match), category, minPrice, maxPrice
app.get("/search", (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;

  // Validate price range if both are provided
  if (minPrice !== undefined && maxPrice !== undefined) {
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (!isNaN(min) && !isNaN(max) && min > max) {
      return res.status(400).json({
        error: "Minimum price cannot be higher than maximum price.",
      });
    }
  }

  let filtered = [...inventory];

  // Filter by product name (case-insensitive partial match)
  if (q && q.trim() !== "") {
    filtered = filtered.filter((item) =>
      item.productName.toLowerCase().includes(q.toLowerCase().trim())
    );
  }

  // Filter by category (case-insensitive exact match)
  if (category && category.trim() !== "") {
    filtered = filtered.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase().trim()
    );
  }

  // Filter by minimum price
  if (minPrice !== undefined && minPrice !== "") {
    const min = Number(minPrice);
    if (!isNaN(min)) {
      filtered = filtered.filter((item) => Number(item.price) >= min);
    }
  }

  // Filter by maximum price
  if (maxPrice !== undefined && maxPrice !== "") {
    const max = Number(maxPrice);
    if (!isNaN(max)) {
      filtered = filtered.filter((item) => Number(item.price) <= max);
    }
  }

  res.json(filtered);
});

// GET /categories — returns unique categories for the dropdown
app.get("/categories", (req, res) => {
  const categories = [...new Set(inventory.map((item) => item.category))].sort();
  res.json(categories);
});

app.listen(PORT, () => {
  console.log(`Part A server running at http://localhost:${PORT}`);
});
