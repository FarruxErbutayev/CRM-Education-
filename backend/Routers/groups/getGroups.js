import { Router } from "express";
import pool from "../../functions/datatabase.js"; 
const router = Router();

router.get("/", async (req, res) => {
    try {
        const groups = await pool.query("SELECT id, group_name, group_teacher, begin_date FROM groups");
        res.status(200).json(groups.rows);
    } catch (err) {
        console.error("Error getting groups", err);
        res.status(500).json({
            message: "Error getting groups",
            details: err.message
        });
    }
});

export default router;
