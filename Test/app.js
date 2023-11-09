const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: "your_database_user",
  host: "your_database_host",
  database: "your_database_name",
  password: "your_database_password",
  port: 5432,
});

app.get("/parties", async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM parties");
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/parties", async (req, res) => {
  try {
    const { name, description, date, location } = req.body;
    const response = await pool.query(
      "INSERT INTO parties (name, description, date, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, date, location]
    );
    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/parties/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await pool.query(
      "DELETE FROM parties WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
