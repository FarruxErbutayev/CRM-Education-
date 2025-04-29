import { Router } from "express";
import Joi from "joi";
import pool from "../../../functions/datatabase.js"; 
const router = Router();

// Validatsiya sxemasi (phone qo‘shildi)
const teacherSchema = Joi.object({
  firstname: Joi.string().min(3).max(500).required(),
  lastname: Joi.string().min(3).max(500).required(),
  birth: Joi.date().iso().default('2004-01-01').required(),
  course_name: Joi.string().min(3).max(500).required(),
  phone: Joi.string().pattern(/^\+998\d{9}$/).required() // Telefon raqami formati: +998901234567
});

router.post("/", async (req, res) => {
  const { error, value } = teacherSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Invalid input data",
      details: error.details
    });
  }

  const { firstname, lastname, birth, course, phone } = value;

  try {
    const newTeacher = await pool.query(
      "INSERT INTO teachers (firstname, lastname, birth, course, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [firstname, lastname, birth, course, phone]
    );

    res.status(201).json(newTeacher.rows[0]); 
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});

export default router;
