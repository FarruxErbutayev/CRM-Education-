import { Router } from "express";
import Joi from "joi";
import pool from "../../functions/datatabase.js"; 
const router = Router();

const groupSchema = Joi.object({
    course_name: Joi.string().required().max(255),
    course_duration: Joi.number().required(),
    course_price: Joi.number().required(),
    course_teacher: Joi.string().required().max(255),
    begin_date: Joi.date().required()
});

router.post("/", async(req, res)=>{
    const {error, value} = groupSchema.validate(req.body);
    if(error){
        return res.status(400).json({
            message: "Invalid input data",
            details: error.details
        });
    }

    const {course_name, course_duration, course_price, course_teacher, begin_date} = value;

    try{
        const newCourse = await pool.query(
            "INSERT INTO courses (course_name, course_duration, course_price, course_teacher, begin_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [course_name, course_duration, course_price, course_teacher, begin_date]
        );
        res.status(201).json(newCourse.rows[0]);
    }catch(err){
        console.error("Error adding course", err);
        res.status(500).json({
            message: "Error adding course",
            details: err.message
        });
    }
    
});
export default router;

