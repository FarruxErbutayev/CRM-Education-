import { Router } from "express";
import Joi from "joi";
import pool from "../../functions/datatabase.js"; 
const router = Router();

const pupilSchema = Joi.object({
  firstname: Joi.string().min(3).max(500).required(),
  lastname: Joi.string().min(3).max(500).required(),
  birth: Joi.date().iso().default('2004-01-01').required(), // sana formatini tekshirish
  course_name: Joi.string().min(3).max(500).required()
});

router.post("/", async (req, res) => {
  const { error, value } = pupilSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Invalid input data",
      details: error.details
    });
  }

  const { firstname, lastname, birth, course_name } = value;

  try {
    const newPupil = await pool.query(
      "INSERT INTO pupil (firstname, lastname, birth, course_name) VALUES ($1, $2, $3, $4) RETURNING *",
      [firstname, lastname, birth, course_name]
    );
    
    res.status(201).json(newPupil.rows[0]); 
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});

export default router;
