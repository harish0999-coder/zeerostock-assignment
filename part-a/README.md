# Zeerostock — Part A: Inventory Search API + UI

## Tech Stack

| Layer    | Technology                      |
|----------|---------------------------------|
| Backend  | Node.js, Express                |
| Frontend | React 18, Vite                  |
| Data     | Static JSON (15 sample records) |

## Features

- `GET /search` with optional query params: `q`, `category`, `minPrice`, `maxPrice`
- Case-insensitive partial product name search
- Multiple filters can be combined
- Returns all results when no filters are provided
- `GET /categories` endpoint for dynamic dropdown
- React frontend with controlled inputs, loading state, and "No results" state
- Responsive layout

## Project Structure

```
part-a/
├── backend/
│   ├── data/inventory.json   ← 15 sample products
│   ├── server.js             ← Express API
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FilterForm.jsx    ← Search inputs & dropdowns
    │   │   └── ProductTable.jsx  ← Results table
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## How to Run Locally

### 1. Start the backend

```bash
cd part-a/backend
npm install
npm start
# Server runs on http://localhost:5000
```

### 2. Start the frontend

```bash
cd part-a/frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

### 3. Test the API (Postman or browser)

```
GET http://localhost:5000/search
GET http://localhost:5000/search?q=keyboard
GET http://localhost:5000/search?category=Electronics
GET http://localhost:5000/search?minPrice=50&maxPrice=200
GET http://localhost:5000/search?q=chair&minPrice=100&maxPrice=400
GET http://localhost:5000/categories
```

## Search Logic Explanation

1. Start with the full inventory array.
2. If `q` is provided, filter items where `productName.toLowerCase().includes(q.toLowerCase())`.
3. If `category` is provided, filter for exact (case-insensitive) category match.
4. If `minPrice` is provided, keep items where `price >= minPrice`.
5. If `maxPrice` is provided, keep items where `price <= maxPrice`.
6. All filters are combined with AND logic — every active filter must pass.
7. Query params are strings, so prices are converted with `Number()` before comparison.
8. If `minPrice > maxPrice`, a `400` error is returned immediately.

## Edge Cases Handled

| Scenario               | Behaviour                                      |
|------------------------|------------------------------------------------|
| Empty query `q`        | Returns all items (no name filter applied)     |
| No filters at all      | Returns all 15 products                        |
| `minPrice > maxPrice`  | Returns HTTP 400 with descriptive error        |
| No matching results    | Returns `[]`; UI shows "No products found"     |
| Backend unreachable    | UI shows a connection error message            |

## Performance Improvement for Large Datasets

For production with thousands of products, the static JSON + in-memory filter would not scale. The best improvement would be to move data to a database (e.g., PostgreSQL) and add the following:

- **Full-text search index** on `product_name` using PostgreSQL's `tsvector` / `GIN` index for fast partial-match queries.
- **Composite index** on `(category, price)` to speed up combined category + price range filters.
- **Pagination** (`LIMIT` / `OFFSET`) so the API never returns thousands of rows at once.
