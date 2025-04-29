import { Router } from "express";
import { checkToken, get_id } from "../../../functions/jwtadmin.js";

const router = Router();

router.get("/", checkToken, async function (req, res) {
  try {
    let adminId = get_id(req, res);
    let data = await global.pool.query(
      `
        select 
teacher.email,
teacher.login,
teacher.firstname,
teacher.brithday,
teacher.address,
teacher.Parent_Name,
teacher.lastname,
teacher.profil_url
from teacher
where teacher.id = $1`,
      [teacherId]
    );

    res.status(200).send(data.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server error" });
  }
});

export default router;
