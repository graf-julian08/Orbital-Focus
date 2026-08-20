import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { setupSocket } from './socket';
import { setupRoutes } from './routes';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Prisma
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Set up Socket.io
const io = setupSocket(server);

// Setup REST Routes
setupRoutes(app, io);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`🚀 Master Control Program (Server) running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
