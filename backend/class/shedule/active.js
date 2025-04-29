import { checkToken } from "../../functions/jwtadmin.js";
import Joi from "joi";
import { Router } from "express";
import pool from "../../functions/database.js"; 

const router = Router();

// Validatsiya sxemasi
const Schema = Joi.object({
  active: Joi.boolean().required(),
  id: Joi.number().required()
});

// Dars jadvalidagi faollikni o‘zgartirish
router.post("/", checkToken, async function (req, res) {
  let checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });

  const { active, id } = req.body;
  try {
    let data = await pool.query(
      `UPDATE schedule SET active = $1 WHERE id = $2 RETURNING *;`,
      [active, id]
    );

    if (data.rowCount === 0) {
      return res.status(404).send({ error: "Class not found" });
    }

    res.status(200).send({ message: "Class status updated successfully", updatedClass: data.rows[0] });
  } catch (error) {
    res.status(500).send({ error: "Server error" });
    console.log(error);
  }
});

export default router;
