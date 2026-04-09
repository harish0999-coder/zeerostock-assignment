const db = require("../db/connection");

// POST /inventory
const createInventory = (req, res) => {
  const { supplier_id, product_name, quantity, price } = req.body;

  // --- Validation ---
  if (!supplier_id) {
    return res.status(400).json({ error: "supplier_id is required." });
  }
  if (!product_name || typeof product_name !== "string" || product_name.trim() === "") {
    return res.status(400).json({ error: "product_name is required." });
  }
  if (quantity === undefined || quantity === null) {
    return res.status(400).json({ error: "quantity is required." });
  }
  if (Number(quantity) < 0) {
    return res.status(400).json({ error: "Quantity must be 0 or greater." });
  }
  if (price === undefined || price === null) {
    return res.status(400).json({ error: "price is required." });
  }
  if (Number(price) <= 0) {
    return res.status(400).json({ error: "Price must be greater than 0." });
  }

  // --- Check supplier exists ---
  const supplier = db.prepare("SELECT * FROM suppliers WHERE id = ?").get(Number(supplier_id));
  if (!supplier) {
    return res.status(400).json({ error: `Invalid supplier_id: no supplier with id ${supplier_id} found.` });
  }

  // --- Insert ---
  try {
    const stmt = db.prepare(
      "INSERT INTO inventory (supplier_id, product_name, quantity, price) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(
      Number(supplier_id),
      product_name.trim(),
      Number(quantity),
      Number(price)
    );
    const item = db
      .prepare("SELECT * FROM inventory WHERE id = ?")
      .get(result.lastInsertRowid);
    return res.status(201).json(item);
  } catch (err) {
    return res.status(500).json({ error: "Database error.", details: err.message });
  }
};

// GET /inventory — all records
const getAllInventory = (req, res) => {
  try {
    const items = db
      .prepare(
        `SELECT i.*, s.name AS supplier_name, s.city AS supplier_city
         FROM inventory i
         JOIN suppliers s ON i.supplier_id = s.id
         ORDER BY i.id`
      )
      .all();
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: "Database error.", details: err.message });
  }
};

// GET /inventory/grouped — grouped by supplier, sorted by total value desc
const getGroupedInventory = (req, res) => {
  try {
    const rows = db
      .prepare(
        `SELECT
           s.id          AS supplier_id,
           s.name        AS supplier_name,
           s.city        AS supplier_city,
           COUNT(i.id)   AS total_items,
           SUM(i.quantity * i.price) AS total_inventory_value
         FROM suppliers s
         JOIN inventory i ON s.id = i.supplier_id
         GROUP BY s.id, s.name, s.city
         ORDER BY total_inventory_value DESC`
      )
      .all();
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: "Database error.", details: err.message });
  }
};

module.exports = { createInventory, getAllInventory, getGroupedInventory };
