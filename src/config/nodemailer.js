import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.HOST_MAIL,
  port: process.env.PORT_MAIL,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASS_MAIL,
  },
});

//Plantilla para confirmar el correo
const sendMailToUser = (userMail, token) => {
  let mailOptions = {
    from: process.env.USER_MAIL,
    to: userMail,
    subject: 'Verifica tu cuenta',
    html: `<p>Hola, haz clic <a href="${process.env.URL_FRONTEND}confirmar/${token}">aquí</a> para confirmar tu cuenta.</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
};

// plantilla para recuperar el password
const sendMailToRecoveryPassword = async (userMail, token) => {
  let info = await transporter.sendMail({
    from: process.env.USER_MAIL,
    to: userMail,
    subject: 'Correo para reestablecer tu contraseña',
    html: `<h1>Sistema de gestion Veterinaria 🐶🐮🦄🦌🐎</h1>
    <hr>
    <a href=${process.env.URL_FRONTEND}recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
    <hr>`,
  });
  console.log('Mensaje enviado satisfactoriamente');
};

//plantilla para registrar paciente
const sendMailToPaciente = async (userMail, password) => {
  let info = await transporter.sendMail({
    from: 'admin@vet.com',
    to: userMail,
    subject: 'Correo de bienvenida',
    html: `
  <h1>Sistema de gestión (VET-ESFOT 🐶 😺)</h1>
  <hr>
  <p>Contraseña de acceso: ${password}</p>
  <a href=${process.env.URL_BACKEND}paciente/login>Clic para iniciar sesión</a>
  <hr>
  <footer>Grandote te da la Bienvenida!</footer>
  `,
  });
  console.log('Mensaje enviado satisfactoriamente: ', info.messageId);
};

export { sendMailToUser, sendMailToRecoveryPassword, sendMailToPaciente };
