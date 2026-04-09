const db = require("../db/connection");

// POST /supplier
const createSupplier = (req, res) => {
  const { name, city } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Supplier name is required." });
  }
  if (!city || typeof city !== "string" || city.trim() === "") {
    return res.status(400).json({ error: "Supplier city is required." });
  }

  try {
    const stmt = db.prepare("INSERT INTO suppliers (name, city) VALUES (?, ?)");
    const result = stmt.run(name.trim(), city.trim());
    const supplier = db.prepare("SELECT * FROM suppliers WHERE id = ?").get(result.lastInsertRowid);
    return res.status(201).json(supplier);
  } catch (err) {
    return res.status(500).json({ error: "Database error.", details: err.message });
  }
};

// GET /supplier — list all suppliers
const getAllSuppliers = (req, res) => {
  try {
    const suppliers = db.prepare("SELECT * FROM suppliers ORDER BY id").all();
    return res.json(suppliers);
  } catch (err) {
    return res.status(500).json({ error: "Database error.", details: err.message });
  }
};

module.exports = { createSupplier, getAllSuppliers };
