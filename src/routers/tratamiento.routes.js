import { Router } from "express";
import {
  detalleTratamiento,
  registrarTratamiento,
  actualizarTratamiento,
  eliminarTratamiento,
  cambiarEstado,
} from "../controllers/tratamiento.controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";
import { validacionTratamiento } from "../middlewares/validacionTratamientos.js";

const router = Router();

router.post(
  "/tratamiento/registro",
  verificarAutenticacion,
  validacionTratamiento,
  registrarTratamiento
);
// router.get("/tratamiento/:id",verificarAutenticacion, detalleTratamiento);
// router.put("tratamiento/:id",verificarAutenticacion, actualizarTratamiento);
// router.delete("tratamiento/:id", verificarAutenticacion, eliminarTratamiento);
//es equivalente a:
router
  .route("/tratamiento/:id")
  .get(verificarAutenticacion, detalleTratamiento)
  .put(verificarAutenticacion, actualizarTratamiento)
  .delete(verificarAutenticacion, eliminarTratamiento);

router.post("/tratamiento/estado/:id", verificarAutenticacion, cambiarEstado);

export default router;
