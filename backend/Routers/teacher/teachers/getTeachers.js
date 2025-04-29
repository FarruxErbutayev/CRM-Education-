import { Router } from "express";
import pool from "../../../functions/datatabase.js"; 
const router = Router();

router.get("/", async(req, res)=>{
    try{
        const teachers = await pool.query("SELECT * FROM teachers");
        res.status(200).json(teachers.rows);
        console.log(teachers.rows)
    } catch(err){
        console.error("Error getting teachers", err);
        res.status(500).json({
            message: "Error getting teachers",
            details: err.message
        });
    }
});

export default router;