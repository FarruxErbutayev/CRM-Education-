import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function sign(id) {
  return jwt.sign({ id }, process.env.JWT, { expiresIn: "24h" });
}

function checkToken(req, res, next) {

  try {
    let id = jwt.verify(req.header("-x-token"), process.env.JWT);
    next();
  } catch (err) {
    return res.status(401).send({ error: "Error token" });
  }
}

function get_id(req, res) {
  try {
    // console.log("process.env.JWT", process.env.JWT)
    return jwt.verify(req.header("-x-token"), process.env.JWT).id;


  } catch (err) {
    return res.status(401).send({ error: "Error token" });
  }

}
export { sign, get_id, checkToken };
