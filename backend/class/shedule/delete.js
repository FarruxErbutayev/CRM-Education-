import { Router } from "express";
import pool from "../../functions/database.js"; 

const router = Router();

// ID bo‘yicha darsni o‘chirish
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query("DELETE FROM schedule WHERE id = $1 RETURNING *", [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Class not found" });
      }
  
      res.status(200).json({
        message: "Class deleted successfully",
        deletedClass: result.rows[0],
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server error",
        error: err.message,
      });
    }
});

export default router;
