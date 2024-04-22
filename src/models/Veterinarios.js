import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const veterinarioSchema = new Schema(
  {
    nombre: {
      type: String,
      require: true,
      // trim elimina espacios en blanco alrededor del valor
      trim: true,
    },
    apellido: {
      type: String,
      require: true,
      trim: true,
    },
    direccion: {
      type: String,
      require: true,
      trim: true,
    },
    telefono: {
      type: Number,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      //compueba que el email sea unico en la bd
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    staus: {
      type: Boolean,
      default: true,
    },
    token: {
      type: String,
      default: null,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    // agrega campos createdAt y updatedAt automáticos a los documentos creados
    // a partir de este esquema, para registrar la fecha y hora de creación y
    // actualización respectivamente.
  }
);

// Método para cifrar el password del veterinario
veterinarioSchema.methods.encrypPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const passwordEncryp = await bcrypt.hash(password, salt);
  return passwordEncryp;
};

// Método para verificar si el password ingresado es el mismo de la BDD
veterinarioSchema.methods.matchPassword = async function (password) {
  const response = await bcrypt.compare(password, this.password);
  return response;
};

// Método para crear un token
veterinarioSchema.methods.crearToken = function () {
  const tokenGenerado = (this.token = Math.random().toString(36).slice(2));
  return tokenGenerado;
};

export default model("Veterinario", veterinarioSchema);
