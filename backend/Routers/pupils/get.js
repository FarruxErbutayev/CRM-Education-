import { Router } from "express";
import pool from "../../functions/datatabase.js"; // Assuming the correct path to your database pool

const router = Router();

// GET ma'lumotlarni pagination bilan olish uchun endpoint
router.get("/", async (req, res) => {
  let { page = 1, size = 10 } = req.query;

  // Parametrlarni raqamga aylantirish
  page = parseInt(page, 10);
  size = parseInt(size, 10);

  // Sahifalash uchun offset va limitni hisoblash
  const offset = (page - 1) * size;

  try {
    // Jami o'quvchilar sonini olish
    const totalPupils = await pool.query("SELECT COUNT(*) FROM pupil");
    
    const total = parseInt(totalPupils.rows[0].count, 10);

    // Sahifalangan ma'lumotlarni olish
    const pupils = await pool.query(
      "SELECT id, firstname, lastname, birth, course_name FROM pupil ORDER BY id ASC"
    );

    // Javobni yuborish
    res.status(200).json({
      total, // Jami o'quvchilar soni
      page,  // Hozirgi sahifa
      size,  // Sahifadagi elementlar soni
      totalPages: Math.ceil(total / size), // Jami sahifalar soni
      data: pupils.rows, // Sahifalangan o'quvchi ma'lumotlari
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

export default router;
