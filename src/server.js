//modulos requeridos
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routerVeterinarios from "./routers/veterinario.routes.js";
import routerPaciente from "./routers/paciente.routes.js";

//Inicializaciones
const app = express();
dotenv.config();

//Configuraciones
app.set("port", process.env.port || 3000);
// investigar de que se tratan los cors
app.use(cors());

//middlewares
app.use(express.json());

//variables gloables

//Rutas
app.use("/api", routerVeterinarios);
app.use("/api", routerPaciente);
//Manejo de ruta no encontrada
app.use((req, res) => res.status(404).send("EndPoint no encontrado"));

//exportar la instancia de express por medio de app
export default app;
