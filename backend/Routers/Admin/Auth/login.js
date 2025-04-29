import { Router } from "express";
import { check } from "../../../functions/bcrypt.js";
import Joi from "joi";
import { sign } from "../../../functions/jwtadmin.js";

const router = Router();

router.post("/", async function (req, res) {
  console.log('Login attempt:', req.body);  // Log the incoming request
  
  let Schema = Joi.object({
    login: Joi.string().required().min(0).max(25),
    password: Joi.string().required().min(0).max(50),
  });
  
  if (Schema.validate(req.body).error) {
    console.log('Validation error:', Schema.validate(req.body).error);
    return res
      .status(400)
      .send({ error: Schema.validate(req.body).error.message });
  }
  
  const { login, password } = req.body;
  try {
    let data = await global.pool.query(
      "Select id, password from admin where login = $1",
      [login]
    );
    console.log('Database response:', data.rows);  // Log database response
    
    if (data.rows.length == 0) {
      console.log('No user found');
      return res.status(400).send({ error: "Login or password error" });
    }

    const isLogin = await check(password, data.rows[0].password);

    
    if (!isLogin) {
      console.log('Password incorrect');
      return res.status(400).send({ error: "Login or password error" });
    }
    
    req.session.adminId = data.rows[0].id;
    req.session.IsAdmin = true;
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.session.clientIp = clientIp;
    
    const token = sign(Number(data.rows[0].id));
    console.log('Generated token:', token);
    
    return res.status(200).send({ token: token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send({ error: "Internal server error" });
  }
});

export default router;