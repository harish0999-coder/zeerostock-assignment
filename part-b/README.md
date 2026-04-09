# Zeerostock — Part B: Inventory Database + APIs

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Backend  | Node.js, Express              |
| Database | SQLite (via better-sqlite3)   |
| Testing  | Postman / curl                |

## Why SQLite (SQL over NoSQL)?

The supplier → inventory relationship is a classic **one-to-many** relational structure. SQL is the natural fit because:

- Foreign key constraints (`supplier_id`) enforce referential integrity at the database level.
- The grouped query (SUM + GROUP BY + ORDER BY) is a single, clean SQL statement — trivial in SQL, complex in NoSQL.
- SQLite requires zero server setup, making it ideal for assignment submission and local testing.

For production, the same schema works unchanged on **PostgreSQL** by swapping the driver.

## Database Schema

```sql
CREATE TABLE suppliers (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT    NOT NULL,
  city TEXT    NOT NULL
);

CREATE TABLE inventory (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id  INTEGER NOT NULL,
  product_name TEXT    NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity >= 0),
  price        REAL    NOT NULL CHECK (price > 0),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);
```

### Relationship
One supplier → many inventory items (via `supplier_id` foreign key).

## Indexing & Optimization

An index is created on `inventory.supplier_id`:

```sql
CREATE INDEX idx_inventory_supplier_id ON inventory(supplier_id);
```

**Why:** Every `JOIN`, `GROUP BY`, and supplier-existence check filters on `supplier_id`. Without an index, SQLite performs a full table scan for each query. With the index, lookups are O(log n) instead of O(n), which matters significantly as inventory grows.

Additional suggestion for production: add a composite index on `(supplier_id, price)` if price-range filtering per supplier becomes a common query pattern.

## Project Structure

```
part-b/
├── src/
│   ├── db/
│   │   ├── schema.sql            ← Table definitions + index
│   │   └── connection.js         ← SQLite connection + schema bootstrap
│   ├── routes/
│   │   ├── supplierRoutes.js     ← POST /supplier, GET /supplier
│   │   └── inventoryRoutes.js    ← POST /inventory, GET /inventory, GET /inventory/grouped
│   ├── controllers/
│   │   ├── supplierController.js ← Supplier business logic
│   │   └── inventoryController.js← Inventory business logic + grouped query
│   └── server.js                 ← Express app entry point
├── package.json
└── README.md
```

## How to Run Locally

```bash
cd part-b
npm install
npm start
# Server runs on http://localhost:5001
```

The SQLite database file (`zeerostock.db`) is auto-created on first run.

## API Reference

### POST /supplier

Create a new supplier.

**Request body:**
```json
{ "name": "Global Office", "city": "Mumbai" }
```

**Response (201):**
```json
{ "id": 1, "name": "Global Office", "city": "Mumbai" }
```

---

### POST /inventory

Add an inventory item.

**Request body:**
```json
{
  "supplier_id": 1,
  "product_name": "Ergonomic Chair",
  "quantity": 50,
  "price": 199.99
}
```

**Response (201):**
```json
{ "id": 1, "supplier_id": 1, "product_name": "Ergonomic Chair", "quantity": 50, "price": 199.99 }
```

**Validation errors (400):**
- `supplier_id` not found → `"Invalid supplier_id"`
- `quantity < 0` → `"Quantity must be 0 or greater"`
- `price <= 0` → `"Price must be greater than 0"`

---

### GET /inventory

Returns all inventory items joined with supplier info.

---

### GET /inventory/grouped

Returns inventory grouped by supplier, sorted by total value descending.

**Response:**
```json
[
  { "supplier_id": 1, "supplier_name": "Global Office", "city": "Mumbai", "total_items": 3, "total_inventory_value": 29998.50 },
  { "supplier_id": 2, "supplier_name": "TechZone", "city": "Delhi",  "total_items": 2, "total_inventory_value": 15000.00 }
]
```

## Validation Rules Summary

| Rule                              | HTTP Status | Message                              |
|-----------------------------------|-------------|--------------------------------------|
| Missing name / city on supplier   | 400         | Field is required                    |
| Invalid supplier_id on inventory  | 400         | Invalid supplier_id                  |
| quantity < 0                      | 400         | Quantity must be 0 or greater        |
| price ≤ 0                         | 400         | Price must be greater than 0         |

## Postman Test Flow

1. `POST /supplier` → create 2–3 suppliers, note their `id` values
2. `POST /inventory` → add items using valid supplier IDs
3. `POST /inventory` with invalid `supplier_id` → expect 400
4. `POST /inventory` with `quantity: -1` → expect 400
5. `POST /inventory` with `price: 0` → expect 400
6. `GET /inventory` → see all items with supplier info
7. `GET /inventory/grouped` → see totals sorted by value
