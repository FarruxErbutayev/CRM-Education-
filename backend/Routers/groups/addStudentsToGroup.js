import { Router } from "express";
import Joi from "joi";
import pool from "../../functions/datatabase.js"; 
const router = Router();

const studentsSchema = Joi.object({
    group_students: Joi.array().items(Joi.number().required()).min(1).required(),
    group_id: Joi.number().required()
});

router.put("/", async(req, res)=>{
    const {error, value} = studentsSchema.validate(req.body);
    if(error){
        return res.status(400).json({
            message: "Invalid input data",
            details: error.details
        });
    }

    const {group_students, group_id} = value;

    try{
        const result = await pool.query(
            "UPDATE groups SET group_students = $1 WHERE id = $2",
            [group_students, group_id]
        );
        if(result.rowCount === 0){
            return res.status(404).json({
                message: "Group not found"
            });
        }
        res.status(200).json({
            message: "Students added to group successfully",
            details: result.rows
        });
    } catch(err){
        console.error("Error adding students to group", err);
        res.status(500).json({
            message: "Error adding students to group",
            details: err.message
        });
    }
});

export default router;
