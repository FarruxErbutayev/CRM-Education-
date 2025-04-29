import { Router } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";

const router = Router();

router.post("/", async function (req, res) {
  // Define the schema for validation
  let Schema = Joi.object({
    firstname: Joi.string().required().trim().min(2).max(50),
    lastname: Joi.string().required().trim().min(2).max(50),
    email: Joi.string().email().required().trim().max(100),
    login: Joi.string().required().trim().min(3).max(25),
    password: Joi.string().required().min(6).max(50),
    birthday: Joi.date().required().max('now'),
    address: Joi.string().required().trim().max(200),
    parent_name: Joi.string().optional().allow('').max(100),
    profil_url: Joi.string().uri().optional().allow(''),
    state: Joi.string().required().valid('active', 'inactive')
  });

  // Validate the request body
  const checkSchema = Schema.validate(req.body);
  if (checkSchema.error)
    return res.status(400).send({ error: checkSchema.error.message });

  const {
    firstname,
    lastname,
    email,
    login,
    password,
    birthday,
    address,
    parent_name,
    profil_url,
    state,
  } = req.body;

  try {
    // Check if login already exists
    const existingLogin = await global.pool.query(
      "SELECT id FROM admin WHERE login = $1",
      [login]
    );

    if (existingLogin.rows.length > 0) {
      return res.status(400).send({ error: "Login already exists" });
    }

    // Check if email already exists
    const existingEmail = await global.pool.query(
      "SELECT id FROM admin WHERE email = $1",
      [email]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(400).send({ error: "Email already exists" });
    }

    // Encrypt the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the admin into the database
    const result = await global.pool.query(
      `INSERT INTO admin (
        firstname, 
        lastname, 
        email, 
        login, 
        password, 
        birthday, 
        address, 
        created_at, 
        parent_name, 
        profil_url, 
        state
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9, $10)
      RETURNING id;`,
      [
        firstname,
        lastname,
        email,
        login,
        hashedPassword,
        birthday,
        address,
        parent_name || null,
        profil_url || null,
        state,
      ]
    );

    return res.status(201).send({ 
      created: true, 
      message: "Admin created successfully",
      adminId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).send({ 
      error: "Internal Server Error",
      message: "Failed to create admin account" 
    });
  }
});

export default router;