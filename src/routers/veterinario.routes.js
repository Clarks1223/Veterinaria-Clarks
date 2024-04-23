//importaciones
import { Router } from "express";
//para proteger las rutas
import verificarAutenticacion from "../middlewares/autenticacion.js";
//middlewar
import { validacionVeterionario } from "../middlewares/validacionVeterinario.js";
// importar funciones desde los controladores
import {
  login,
  perfil,
  registro,
  confirmarEmail,
  listaVeterinarios,
  detallleVeterinario,
  actualizarPerfil,
  actualizarPassword,
  recuperarPassword,
  comprobarTokenPassword,
  nuevoPassword,
} from "../controllers/veterinario.controller.js";

const router = Router();
router.post("/login", login);
router.post("/registro", validacionVeterionario, registro);
router.get("/confirmar/:token", confirmarEmail);
router.get("/veterinarios", listaVeterinarios);
router.post("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPassword);
router.post("/nuevo-password/:token", nuevoPassword);
// estas rutas se protegen por que se muestran luego de que el usuario ha iniciado sesion
router.get("/perfil", verificarAutenticacion, perfil);
router.put(
  "/veterinario/actualizarpassword",
  verificarAutenticacion,
  actualizarPassword
);
router.get("/veterinario/:id", verificarAutenticacion, detallleVeterinario);
router.put("/veterinario/:id", verificarAutenticacion, actualizarPerfil);
export default router;
