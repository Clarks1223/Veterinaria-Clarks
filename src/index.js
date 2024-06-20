//modulos requeridos
import app from './server.js';
import connection from './database.js';
//configuracion necesaria para el chat
import http from 'http';
import { Server } from 'socket.io';

connection();

//Servidor del chat
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});


io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('enviar-mensaje-fron-back', (payload) => {
    socket.broadcast.emit('enviar-mensaje-fron-back', payload);
  });
});

//Servidor
app.listen(app.get('port'), () => {
  console.log(`Servidor levantado en http://localhost:${app.get('port')}`);
});
