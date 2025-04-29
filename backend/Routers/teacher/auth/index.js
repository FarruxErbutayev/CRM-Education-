import { Router } from "express";
import { check } from "../../../functions/bcrypt.js";
import Joi from "joi";
import { sign } from "../../../functions/jwtadmin.js"; // O‘qituvchilar uchun JWT

const router = Router();

router.post("/", async function (req, res) {
  let Schema = Joi.object({
    login: Joi.string().required().min(3).max(25), // 3 ta belgidan kam bo‘lmasligi kerak
    password: Joi.string().required().min(6).max(50), // Parol kamida 6 ta belgidan iborat bo‘lishi kerak
  });

  let validate = Schema.validate(req.body);
  if (validate.error) {
    return res.status(400).send({ error: validate.error.message });
  }

  const { login, password } = req.body;

  try {
    let data = await global.pool.query(
      "SELECT id, password FROM teachers WHERE login = $1",
      [login]
    );

    if (data.rows.length === 0) {
      return res.status(400).send({ error: "Login yoki parol noto‘g‘ri" });
    }

    const isValidPassword = await check(password, data.rows[0].password);
    if (!isValidPassword) {
      return res.status(400).send({ error: "Login yoki parol noto‘g‘ri" });
    }

    req.session.teacherId = data.rows[0].id;
    req.session.isTeacher = true; // O‘qituvchi ekanligini belgilash

    const token = sign(Number(data.rows[0].id));

    res.status(200).send({ token });

    // Client IP-ni olish
    const clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    req.session.clientIp = clientIp;
  } catch (error) {
    console.error("Server xatosi:", error);
    return res.status(500).send({ error: "Ichki server xatosi" });
  }
});

export default router;
