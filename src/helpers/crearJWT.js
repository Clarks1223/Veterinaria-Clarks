//importaciones necesarias
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//esta funcion permite encriptar el token en base a 3 parametros
const generarJWT = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export default generarJWT;
