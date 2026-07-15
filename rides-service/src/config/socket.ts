import { Server } from 'socket.io';
import http from 'http';

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Driver joins their own room
    socket.on('driver:join', (driverId: string) => {
      socket.join(`driver:${driverId}`);
      console.log(`Driver ${driverId} joined`);
    });

    // Rider joins trip room
    socket.on('rider:join', (tripId: string) => {
      socket.join(`trip:${tripId}`);
      console.log(`Rider joined trip ${tripId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket not initialized');
  return io;
};