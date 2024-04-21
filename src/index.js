//modulos requeridos
import app from "./server.js";
import connection from "./database.js";

app.listen(app.get("port"), () => {
  console.log(`Servidor levantado en http://localhost:${app.get("port")}`);
});

connection();
