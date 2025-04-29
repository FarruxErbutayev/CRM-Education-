import { Router } from "express";
import Joi from "joi";
import pool from "../../functions/datatabase.js"; 

const router = Router();

// Joi validatsiya shabloni
const pupilSchema = Joi.object({
  firstname: Joi.string().min(3).max(500).optional(),
  lastname: Joi.string().min(3).max(500).optional(),
  birth: Joi.date().iso().optional(), // sana formatini tekshirish
  course_name: Joi.string().min(3).max(500).optional()
});

// O'quvchi ma'lumotlarini yangilash uchun endpoint
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  // Validatsiya qilish
  const { error, value } = pupilSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Invalid input data",
      details: error.details
    });
  }

  // O'zgartirish uchun dinamik SQL so'rovi
  const fields = Object.keys(value);
  if (fields.length === 0) {
    return res.status(400).json({
      message: "No fields provided for update"
    });
  }

  const updates = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
  const values = Object.values(value);

  try {
    const updatedPupil = await pool.query(
      `UPDATE pupil SET ${updates} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );

    if (updatedPupil.rows.length === 0) {
      return res.status(404).json({ message: "Pupil not found" });
    }

    res.status(200).json(updatedPupil.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});

export default router;
