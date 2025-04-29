import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "./db.js"; // PostgreSQL ulanishi

const router = express.Router();

// O'quvchi ro‘yxatdan o‘tishi
router.post("/student/signup", async (req, res) => {
    const { fullname, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newStudent = await pool.query(
            "INSERT INTO students (fullname, email, password_hash, phone) VALUES ($1, $2, $3, $4) RETURNING *",
            [fullname, email, hashedPassword, phone]
        );
        res.json({ message: "Ro‘yxatdan o‘tildi", student: newStudent.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Xatolik yuz berdi" });
    }
});

// Ota-ona ro‘yxatdan o‘tishi
router.post("/parent/signup", async (req, res) => {
    const { fullname, email, password, student_id, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newParent = await pool.query(
            "INSERT INTO parents (fullname, email, password_hash, student_id, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [fullname, email, hashedPassword, student_id, phone]
        );
        res.json({ message: "Ro‘yxatdan o‘tildi", parent: newParent.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Xatolik yuz berdi" });
    }
});

// Login (foydalanuvchi turi aniqlanadi)
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         let user = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
//         let userType = "student";

//         if (user.rows.length === 0) {
//             user = await pool.query("SELECT * FROM parents WHERE email = $1", [email]);
//             userType = "parent";
//         }

//         if (user.rows.length === 0) {
//             return res.status(401).json({ error: "Email yoki parol noto‘g‘ri" });
//         }

//         const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
//         if (!validPassword) {
//             return res.status(401).json({ error: "Email yoki parol noto‘g‘ri" });
//         }

//         const token = jwt.sign({ id: user.rows[0].id, type: userType }, "SECRET_KEY", { expiresIn: "1h" });

//         res.json({ message: "Tizimga kirdingiz", token, userType });

//     } catch (err) {
//         res.status(500).json({ error: "Xatolik yuz berdi" });
//     }
// });

export default router;
