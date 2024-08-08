import e from 'express';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

const app = e();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "*", // Asegúrate de configurar el CORS correctamente en producción
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Conexión exitosa');

  socket.on('send_message', (message) => {
    console.log('Mensaje recibido:', message);
    // Emitir el mensaje a todos los clientes conectados
    io.emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado');
  });
});

// Cambié app.listen a server.listen para que funcione correctamente con Socket.IO
server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
