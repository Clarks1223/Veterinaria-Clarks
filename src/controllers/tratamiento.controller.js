//importaciones necesarias
import Tratamiento from "../models/Tratamiento.js";
import Paciente from "../models/Paciente.js";
import mongoose from "mongoose";

const detalleTratamiento = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el veterinario ${id}` });
  const paciente = await Paciente.findById(id)
    .select("-createdAt -updatedAt -__v")
    .populate("veterinario", "_id nombre apellido");
  const tratamientos = await Tratamiento.find({ estado: true })
    .where("paciente")
    .equals(id);
  res.status(200).json({
    paciente,
    tratamientos,
  });
};

const registrarTratamiento = async (req, res) => {
  const { paciente, prioridad } = req.body;
  if (!mongoose.Types.ObjectId.isValid(paciente))
    return res.status(404).json({ msg: "el id del paciente no es valido" });
  const pacienteBDD = await Paciente.findOne({ _id: paciente });
  if (!pacienteBDD)
    return res.status(404).json({ msg: "No se ha encontrado al paciente " });
  if (prioridad != "Alta" && prioridad != "Media" && prioridad != "Baja")
    return res.status(404).json({ msg: "La prioridad es incorrecta" });
  const tratamiento = await Tratamiento.create(req.body);
  res.status(200).json({
    msg: `Registro exitoso del paciente ${tratamiento._id}`,
    tratamiento,
  });
};
const actualizarTratamiento = async (req, res) => {
  const { id } = req.params;
  if (Object.values(req.params).includes(""))
    return res.status(200).json({ msg: "Debe llenar todos los datos" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(200).json({ msg: `No existe el tratamiento ${id}` });
  await Tratamiento.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({ msg: "Tratamiento actualizado correctamente" });
};
const eliminarTratamiento = async (req, res) => {
  const { id } = req.params;
  if (Object.values(req.body).includes(""))
    return res.status(400).json({ msg: "Debes llenar todos los campos" });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: "El id del elemento no es correcto " });
  await Tratamiento.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ msg: "Se ha eliminado el tratamiento correctamente" });
};
const cambiarEstado = async (req, res) => {
  // activo: El paciente tiene un tratamiento activo el cual esta aún siendo atendido y se presenta en la UI.
  // desactivado: El paciente no tiene un tratamiento activo el cual ya ha sido atendido, finalizado y no se presentará en la UI.
  await Tratamiento.findByIdAndUpdate(req.params.id, { estado: false });
  res
    .status(200)
    .json({ msg: "Estado del tratamiento modificado exitosamente" });
};
export {
  detalleTratamiento,
  registrarTratamiento,
  actualizarTratamiento,
  eliminarTratamiento,
  cambiarEstado,
};
