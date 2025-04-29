import { Router } from "express";
import Joi from "joi";
import pool from "../../functions/datatabase.js"; 
const router = Router();

const groupSchema = Joi.object({
    group_name: Joi.string().required().max(255),
    group_teacher: Joi.string().required().max(255),
    begin_date: Joi.date().required()
});

router.post("/", async(req, res)=>{
    const {error, value} = groupSchema.validate(req.body);
    if(error){
        return res.status(400).json({
            message: "Invalid input data",
            details: error.details
        })
    }

    const {group_name, group_teacher, begin_date} = value;

    try{
        const newGroup = await pool.query(
            "INSERT INTO groups (group_name, group_teacher, begin_date) VALUES ($1, $2, $3) RETURNING *",
            [group_name, group_teacher, begin_date]
        );
        res.status(201).json(newGroup.rows[0]);
    } catch(err){
        console.error("Error adding group", err);
        res.status(500).json({
            message: "Error adding group",
            details: err.message
        });
    }
});
export default router;
