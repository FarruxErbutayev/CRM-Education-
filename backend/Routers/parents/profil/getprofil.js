import { Router } from "express";
import { checkToken, get_id } from "../../../functions/jwtadmin.js";

const router = Router();

router.get("/", checkToken, async function (req, res) {
  try {
    let adminId = get_id(req, res);
    let data = await global.pool.query(
      `
        select 
parents.email,
parents.login,
parents.firstname,
parents.brithday,
parents.address,
parents.Parent_Name,
parents.lastname,
parents.profil_url
from parents
where parents.id = $1`,
      [parentsId]
    );

    res.status(200).send(data.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Server error" });
  }
});

export default router;
