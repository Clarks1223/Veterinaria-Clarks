import mongoose, { Schema, model } from "mongoose";
const tratamientoSchema = new Schema(
  {
    nombre: {
      type: String,
      require: true,
      trim: true,
    },
    descripcion: {
      type: String,
      require: true,
      trim: true,
    },
    estado: {
      type: Boolean,
      default: true,
      require: true,
    },
    prioridad: {
      type: String,
      require: true,
      enum: ["Baja", "Media", "Alta"],
    },
    paciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paciente",
    },
  },
  {
    //Para verificar cuando se creo y cuando fue la ultima vez que se actualizo
    timestamps: true,
  }
);

export default model("Tratamiento", tratamientoSchema);
