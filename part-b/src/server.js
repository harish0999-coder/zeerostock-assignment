const express = require("express");
const cors = require("cors");
const supplierRoutes = require("./routes/supplierRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/supplier", supplierRoutes);
app.use("/inventory", inventoryRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Zeerostock Part B API is running." });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Part B server running at http://localhost:${PORT}`);
});
