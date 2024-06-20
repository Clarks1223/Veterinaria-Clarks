import { Router } from 'express';
//archivo para proteger las rutas
import verificarAutenticacion from '../middlewares/autenticacion.js';
import {
  loginPaciente,
  perfilPaciente,
  listarPacientes,
  detallePaciente,
  registrarPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from '../controllers/paciente.controller.js';

const router = Router();

router.post('/paciente/login', loginPaciente);
router.get('/paciente/perfil', verificarAutenticacion, perfilPaciente);
router.get('/pacientes/:id', verificarAutenticacion, listarPacientes);
router.get('/paciente/:id', verificarAutenticacion, detallePaciente);
router.post('/paciente/registro', verificarAutenticacion, registrarPaciente);
router.put(
  '/paciente/actualizar/:id',
  verificarAutenticacion,
  actualizarPaciente
);
router.delete(
  '/paciente/eliminar/:id',
  verificarAutenticacion,
  eliminarPaciente
);

export default router;
