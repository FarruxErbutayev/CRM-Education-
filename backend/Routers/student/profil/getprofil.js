import { Router } from "express";
import { checkToken, get_id } from "../../../functions/jwtadmin.js";

const router = Router();

router.get("/", checkToken, async function (req, res) {
  try {
    let adminId = get_id(req, res);
    let data = await global.pool.query(
      `
        select 
student1.email,
student1.login,
student1.firstname,
student1.brithday,
student1.address,
student1.Parent_Name,
student1.lastname,
student1.profil_url
from student1
where student1.id = $1`,
      [adminId]
    );

    res.status(200).send(data.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server error" });
  }
});

export default router;
