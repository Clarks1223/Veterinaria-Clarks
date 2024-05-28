// importo del squema
import Veterinario from '../models/Veterinarios.js';
//importo la configuracion para enviar mails
import {
  sendMailToRecoveryPassword,
  sendMailToUser,
} from '../config/nodemailer.js';
import mongoose from 'mongoose';

//importo el token generado con JWT
import generarJWT from '../helpers/crearJWT.js';

const login = async (req, res) => {
  const { email, password } = req.body;
  if (Object.values(req.body).includes(''))
    return res.status(400).json({ msg: 'Debe llenar todos los campos' });
  const veterinarioBDD = await Veterinario.findOne({ email }).select(
    '-status -__v -token -updatedAt -createdAt'
  );
  if (veterinarioBDD?.confirmEmail == false)
    return res.status(404).json({ msg: 'Debes verificar el email' });

  if (!veterinarioBDD)
    return res.status(404).json({ msg: 'Este usuario no ha sido registrado' });

  const verificarPassword = await veterinarioBDD.matchPassword(password);
  if (!verificarPassword)
    return res.status(404).json({ msg: 'La contraseña es incorrecta' });

  const token = generarJWT(veterinarioBDD._id, 'veterinario');
  const { nombre, apellido, direccion, telefono, _id } = veterinarioBDD;

  res.status(200).json({
    token,
    nombre,
    apellido,
    direccion,
    telefono,
    _id,
    email: veterinarioBDD.email,
  });
};
const perfil = (req, res) => {
  delete req.veterinarioBDD.token;
  delete req.veterinarioBDD.confirmEmail;
  delete req.veterinarioBDD.createAt;
  delete req.veterinarioBDD.updateAt;
  delete req.veterinarioBDD.__v;
  res.status(200).json(req.veterinarioBDD);
};
const registro = async (req, res) => {
  const { email, password } = req.body;
  if (Object.values(req.body).includes(''))
    return res.status(400).json({ msg: 'Debes llenar todos los campos' });
  const verificaEmailBDD = await Veterinario.findOne({ email });
  if (verificaEmailBDD)
    return res.status(400).json({ msg: 'Este email ya ha sido resgistrado' });
  const nuevoVeterinario = new Veterinario(req.body);
  nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password);

  const token = nuevoVeterinario.crearToken();
  await sendMailToUser(email, token);
  await nuevoVeterinario.save();
  res
    .status(200)
    .json({ msg: 'Revisa tu correo para para confirmar tu cuenta' });
};
const confirmarEmail = async (req, res) => {
  if (!req.params.token)
    return res.status(400).json({ msg: 'No se puede validar la cuenta' });
  const veterinarioBDD = await Veterinario.findOne({ token: req.params.token });
  if (!veterinarioBDD?.token)
    return res.status(404).json({ msg: 'Esta cuenta ya ha sido confirmada' });
  veterinarioBDD.token = null;
  veterinarioBDD.confirmEmail = true;
  await veterinarioBDD.save();
  res.status(200).json({ msg: 'Token confirmado, ya puedes iniciar sesion' });
};
const listaVeterinarios = (req, res) => {
  res.status(200).json({ res: 'Lista de veterinarios registrados' });
};
const detallleVeterinario = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: 'Id invalido' });
  const veterinarioBDD = await Veterinario.findById(id).select('-password');
  if (!veterinarioBDD)
    return res.status(404).json({ msg: `no existe el veterinario  ${id}` });
  res.status(200).json({ msg: veterinarioBDD });
};
const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: 'El id no es valido' });
  if (Object.values(req.body).includes(''))
    return res.status(400).json({ msg: 'Debe llenar todos los datos' });
  const veterinarioBDD = await Veterinario.findById(id);
  if (!veterinarioBDD)
    return res
      .status(404)
      .json({ msg: `No se ha encontrado al veterinario ${id}` });

  if (veterinarioBDD.email != req.body.email) {
    const veterinarioBDDMail = await Veterinario.findOne({
      email: req.body.email,
    });
    if (veterinarioBDDMail) {
      return res
        .status(404)
        .json({ msg: 'El email ya se encuentra registrado' });
    }
  }
  veterinarioBDD.nombre = req.body.nombre || veterinarioBDD?.nombre;
  veterinarioBDD.apellido = req.body.apellido || veterinarioBDD?.apellido;
  veterinarioBDD.direccion = req.body.direccion || veterinarioBDD?.direccion;
  veterinarioBDD.telefono = req.body.telefono || veterinarioBDD?.telefono;
  veterinarioBDD.email = req.body.email || veterinarioBDD?.email;
  await veterinarioBDD.save();
  res.status(200).json({ msg: 'Perfil actualizado correctamente' });
};
const actualizarPassword = async (req, res) => {
  const veterinarioBDD = await Veterinario.findById(req.veterinarioBDD._id);
  if (!veterinarioBDD)
    return res.status(404).json({ msg: 'No se ha encontrado al usuario' });
  const verificarPassword = await veterinarioBDD.matchPassword(
    req.body.passwordactual
  );
  if (!verificarPassword)
    return res.status(404).json({ msg: 'El password actual no es correcto' });
  veterinarioBDD.password = await veterinarioBDD.encrypPassword(
    req.body.passwordnuevo
  );
  await veterinarioBDD.save();
  res.status(200).json({ msg: 'Su contraseña se ha cambiado correctamente' });
};
const recuperarPassword = async (req, res) => {
  const { email } = req.body;
  if (Object.values(req.body).includes(''))
    return res.status(404).json({ msg: 'Debe llenar todos los campos' });
  const veterinarioBDD = await Veterinario.findOne({ email });
  if (!veterinarioBDD)
    return res.status(404).json({ msg: 'EL email no se encuentra registrado' });
  const token = veterinarioBDD.crearToken();
  veterinarioBDD.token = token;
  await sendMailToRecoveryPassword(email, token);
  await veterinarioBDD.save();
  res.status(200).json({ msg: 'Revisa tu correo para reestablecer tu cuenta' });
};
const comprobarTokenPassword = async (req, res) => {
  if (!req.params.token)
    return res.status(404).json({ msg: 'No se puede verificar el token' });
  const veterinarioBDD = await Veterinario.findOne({ token: req.params.token });
  if (veterinarioBDD?.token !== req.params.token)
    return res.status(404).json({ msg: 'No se puede verificar el token' });
  res
    .status(200)
    .json({ msg: 'Token Confirmadom ya puedes crear tu nuevo password' });
};
const nuevoPassword = async (req, res) => {
  const { password, confirmpassword } = req.body;

  if (Object.values(req.body).includes(''))
    return res.status(404).json({ msg: 'Debe llenar todos los campos' });

  if (password !== confirmpassword)
    return res.status(404).json({ msg: 'Las contraseñas no coinciden' });
  const veterinarioBDD = await Veterinario.findOne({ token: req.params.token });

  if (veterinarioBDD?.token !== req.params.token)
    return res.status(404).json({ msg: 'No se puede validar la cuenta' });

  veterinarioBDD.token = null;
  veterinarioBDD.password = await veterinarioBDD.encrypPassword(password);
  await veterinarioBDD.save();
  res.status(200).json({
    msg: 'Felicidades, ya puedes iniciar sesion con tu nueva contraseña',
  });
};

export {
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
};
