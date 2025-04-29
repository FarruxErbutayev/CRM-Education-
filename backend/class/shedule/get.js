import { Router } from "express";
import pool from "../../functions/database.js"; 

const router = Router();

// GET ma'lumotlarni pagination bilan olish
router.get("/", async (req, res) => {
  let { page = 1, size = 10 } = req.query;

  // Parametrlarni raqamga aylantirish
  page = parseInt(page, 10);
  size = parseInt(size, 10);

  // Sahifalash uchun offset va limitni hisoblash
  const offset = (page - 1) * size;

  try {
    // Jami darslar sonini olish
    const totalClasses = await pool.query("SELECT COUNT(*) FROM schedule");
    const total = parseInt(totalClasses.rows[0].count, 10);

    // Sahifalangan dars jadvalini olish
    const classes = await pool.query(
      "SELECT * FROM schedule ORDER BY id ASC LIMIT $1 OFFSET $2",
      [size, offset]
    );

    res.status(200).json({
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
      data: classes.rows,
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
