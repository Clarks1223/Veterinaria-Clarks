import Paciente from '../models/Paciente.js';
import Veterinario from '../models/Veterinarios.js';
import { sendMailToPaciente } from '../config/nodemailer.js';
import generarJWT from '../helpers/crearJWT.js';
import mongoose, { mongo } from 'mongoose';

const loginPaciente = async (req, res) => {
  const { email, password } = req.body;
  if (Object.values(req.body).includes(''))
    return res
      .status(404)
      .json({ msg: 'Lo sentimos, debes llenar todos los campos' });
  const pacienteBDD = await Paciente.findOne({ email });
  if (!pacienteBDD)
    return res
      .status(404)
      .json({ msg: 'Lo sentimos, el usuario no se encuentra registrado' });
  const verificarPassword = await pacienteBDD.matchPassword(password);
  if (!verificarPassword)
    return res
      .status(404)
      .json({ msg: 'Lo sentimos, el password no es el correcto' });
  const token = generarJWT(pacienteBDD._id, 'paciente');
  const {
    nombre,
    propietario,
    email: emailP,
    celular,
    convencional,
    _id,
  } = pacienteBDD;
  res.status(200).json({
    token,
    nombre,
    propietario,
    emailP,
    celular,
    convencional,
    rol: 'paciente',
    _id,
  });
};
const perfilPaciente = (req, res) => {
  res.send('pagina para ver el perfil de un paciente');
};

const listarPacientes = async (req, res) => {
  const { id } = req.params;
  //verifico que el id sea valido
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: `Lo sentimos, no existe el paciente` });
  //Verifico que el id pertenezca a un paciente
  const solicitante = await Paciente.findById(id);
  //
  if (solicitante) {
    const consultaPaciente = await Paciente.find({ _id: id, estado: true });
    return res.status(200).json( consultaPaciente);
  } else {
    const solicitante2 = await Veterinario.findById(id);
    if (!solicitante2)
      return res
        .status(404)
        .json({ msg: 'No se ha podido localizar al paciente' });

    const consultaVet = await Paciente.find({
      veterinario: id,
      estado: true,
    });
    return res.status(200).json(consultaVet);
  }
};

const detallePaciente = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el veterinario ${id}` });

  const paciente = await Paciente.findById(id)
    .select('-createdAt -updatedAt -__v')
    .populate('veterinario', '_id nombre apellido');
  res.status(200).json(paciente);
};
const registrarPaciente = async (req, res) => {
  const { email } = req.body;
  if (Object.values(req.body).includes(''))
    return res
      .status(400)
      .json({ msg: 'Lo sentimos, debes llenar todos los campos' });
  const verificarEmailBDD = await Paciente.findOne({ email });
  if (verificarEmailBDD)
    return res
      .status(400)
      .json({ msg: 'Lo sentimos, el email ya se encuentra registrado' });
  const nuevoPaciente = new Paciente(req.body);
  const password = Math.random().toString(36).slice(2);
  nuevoPaciente.password = await nuevoPaciente.encrypPassword('vet' + password);
  await sendMailToPaciente(email, 'vet' + password);
  nuevoPaciente.veterinario = req.veterinarioBDD._id;
  await nuevoPaciente.save();
  res
    .status(200)
    .json({ msg: 'Registro exitoso del paciente y correo enviado' });
};
const actualizarPaciente = async (req, res) => {
  const { id } = req.params;
  if (Object.values(req.params).includes(''))
    return res.status(400).json({ msg: 'Debes llenar todos los campos' });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ msg: `No existe el veterinario ${id}` });
  await Paciente.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({ msg: 'Actualizacion exitosa del paciente' });
};
const eliminarPaciente = async (req, res) => {
  const { id } = req.params;
  if (Object.values(req.params).includes(''))
    return res.status(200).json({ msg: 'Debe ingresar todos los datos' });
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ msg: `No existe el verterinario ${id}` });
  const { salida } = req.body;
  await Paciente.findByIdAndUpdate(req.params.id, {
    salida: Date.parse(salida),
    estado: false,
  });
  res.status(200).json({ msg: 'La fecha de salida se ha actualizado' });
};

export {
  loginPaciente,
  perfilPaciente,
  listarPacientes,
  detallePaciente,
  registrarPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
