import { Router } from "express";
import pool from "../../functions/datatabase.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const schedules = await pool.query(`
            SELECT 
                s.id,
                g.group_name,
                c.course_name AS subject_name,
                t.firstname AS teacher_first_name,
                s.day,
                s.start_time,
                s.end_time
            FROM schedule s
            JOIN groups g ON s.group_id::int = g.id
            JOIN teachers t ON s.teacher::int = t.id
            JOIN courses c ON s.subject::int = c.id
        `);

        res.status(200).json(schedules.rows);
    } catch (err) {
        console.error("Error getting schedule", err);
        res.status(500).json({
            message: "Error getting schedule",
            details: err.message
        });
    }
});

export default router;
