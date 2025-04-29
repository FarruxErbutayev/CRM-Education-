import { Router } from "express";
import Joi from "joi";
import pool from "../../functions/database.js"; 

const router = Router();

// Dars jadvali uchun validatsiya sxemasi
const scheduleSchema = Joi.object({
  day: Joi.string().valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday").required(),
  subject: Joi.string().min(3).max(500).required(),
  start_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // HH:MM format
  end_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  room_number: Joi.string().min(1).max(50).required()
});

// Yangi dars qo‘shish
router.post("/", async (req, res) => {
  const { error, value } = scheduleSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Invalid input data",
      details: error.details
    });
  }

  const { day, subject, start_time, end_time, room_number } = value;

  try {
    const newClass = await pool.query(
      "INSERT INTO schedule (day, subject, start_time, end_time, room_number) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [day, subject, start_time, end_time, room_number]
    );
    
    res.status(201).json(newClass.rows[0]); 
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});

export default router;
