import { Router } from "express";
import { checkToken, get_id } from "../../../functions/jwtadmin.js";
import Joi from "joi";

const router = Router();

router.put("/", checkToken, async function (req, res) {
  // Kiruvchi ma'lumotlarni tekshirish uchun schema
  let Schema = Joi.object({
    email: Joi.string().email().required().min(3).max(45),
    firstname: Joi.string().required().min(3).max(15),
    lastname: Joi.string().required().min(3).max(15),
    birthday: Joi.string().required(),
    address: Joi.string().required().min(3).max(45),
    parent_name: Joi.string().required().min(3).max(45),
    profil_url: Joi.string().uri().optional(),
  });

  let checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });

  const { email, firstname, lastname, birthday, address, parent_name, profil_url } = req.body;

  try {
    const adminId = get_id(req, res);

    // Admin ma'lumotlarini yangilash
    let data = await global.pool.query(
      `UPDATE admin
       SET 
         firstname = $1,
         lastname = $2,
         email = $3,
         birthday = $4,
         address = $5,
         parent_name = $6,
         profil_url = COALESCE($7, profil_url)
       WHERE id = $8`,
      [firstname, lastname, email, birthday, address, parent_name, profil_url, adminId]
    );

    if (data.rowCount === 0) {
      return res.status(404).send({ error: "Admin not found" });
    }

    res.send({ Edited: true });
  } catch (error) {
    if (error.code === "22008")
      return res.status(400).send({ error: error.hint });
    if (error.code === "23505")
      return res.status(400).send({ error: error.detail });
    if (error.code === "22P02")
      return res.status(400).send({ error: error.severity });

    console.error("Error updating admin profile:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default router;