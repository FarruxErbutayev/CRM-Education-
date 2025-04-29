import { Router } from "express";
import pool from "../../functions/datatabase.js"; 
const router = Router();

// Qarzdorlar ro'yxatini olish
router.get("/", async (req, res) => {
  try {
    const debtors = await pool.query("SELECT * FROM debtors");
    if (debtors.rowCount === 0) {
      return res.status(404).json({ message: "No debtors found" });
    }
    res.status(200).json(debtors.rows);
  } catch (err) {
    console.error("Error getting debtors", err);
    res.status(500).json({
      message: "Error getting debtors",
      details: err.message,
    });
  }
});



export default router;