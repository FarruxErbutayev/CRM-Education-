const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 4100;

app.use(cors());
app.use(express.json());

// PostgreSQL ga ulanish
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test_db",
  password: "73771",
  port: 5432,
});

// To'lovlar ro'yxatini olish
app.get("/payments", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM payments ORDER BY payment_date DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Serverda xatolik yuz berdi" });
  }
});

// Yangi to'lov qo'shish
app.post("/payments", async (req, res) => {
  const { student_name, amount, status } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO payments (student_name, amount, status) VALUES ($1, $2, $3) RETURNING *",
      [student_name, amount, status]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({ error: "Serverda xatolik yuz berdi" });
  }
});

// Serverni ishga tushirish
app.listen(port, () => {
  console.log(`Server ishga tushdi: http://localhost:${port}`);
});
