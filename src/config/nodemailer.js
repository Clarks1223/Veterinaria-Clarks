import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter = nodemailer.createTransport({
  service: "gmail",
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
    subject: "Verifica tu cuenta",
    html: `<p>Hola, haz clic <a href="${
      process.env.URL_BACKEND
    }confirmar/${encodeURIComponent(
      token
    )}">aquí</a> para confirmar tu cuenta.</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Correo enviado: " + info.response);
    }
  });
};

// plantilla para recuperar el password
const sendMailToRecoveryPassword = async (userMail, token) => {
  let info = await transporter.sendMail({
    from: "gustavouchuarii@gmail.com",
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: `<h1>Sistema de gestion Veterinaria 🐶🐮🦄🦌🐎</h1>
    <hr>
    <a href=${process.env.URL_BACKEND}recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
    <hr>`,
  });
  console.log("Mensaje enviado satisfactoriamente");
};
export { sendMailToUser, sendMailToRecoveryPassword };
