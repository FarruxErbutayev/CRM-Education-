import { Router } from "express";
import pool from "../../functions/datatabase.js"; 

const router = Router();
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query("DELETE FROM pupil WHERE id = $1 RETURNING *", [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Pupil not found" });
      }
  
      res.status(200).json({
        message: "Pupil deleted successfully",
        deletedPupil: result.rows[0],
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
  