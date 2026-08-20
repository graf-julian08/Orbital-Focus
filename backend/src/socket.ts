import { Server, Socket } from 'socket.io';
import http from 'http';

export function setupSocket(server: http.Server) {
    const io = new Server(server, {
        cors: {
            origin: '*', // For development. Update with actual Next.js frontend URL later!
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        },
    });

    io.on('connection', (socket: Socket) => {
        console.log(`📡 Client connected: ${socket.id}`);

        // Handle joining user specific rooms if needed
        socket.on('join-room', (userId: string) => {
            socket.join(userId);
            console.log(`User ${userId} joined room`);
        });

        // Real-time task update event
        socket.on('task-updated', (data) => {
            // Broadcast the update to all other connected clients
            socket.broadcast.emit('sync-task', data);
        });

        // Pomodoro timer sync events
        socket.on('pomodoro-tick', (data) => {
            socket.broadcast.emit('sync-pomodoro', data);
        });

        socket.on('disconnect', () => {
            console.log(`🛰️ Client disconnected: ${socket.id}`);
        });
    });

    return io;
}
