import { Express, Request, Response } from 'express';
import { prisma } from './server';
import { Server } from 'socket.io';

export function setupRoutes(app: Express, io: Server) {
    // Health check
    app.get('/api/health', (req: Request, res: Response) => {
        res.json({ status: 'ok', message: 'Orbital Focus API is online.' });
    });

    // --- Tasks API ---

    // GET all tasks (In a real app, you'd filter by userId)
    app.get('/api/tasks', async (req: Request, res: Response) => {
        try {
            const tasks = await prisma.task.findMany();
            res.json(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // POST create a new task
    app.post('/api/tasks', async (req: Request, res: Response) => {
        try {
            const { title, description, distance, speed, color, userId } = req.body;

            // For now, if no userId is provided, we'll create a dummy user or just require it.
            // In development, let's create a default user if none exists to make it easy to start.
            let user = await prisma.user.findFirst();
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: 'test@orbitalfocus.com',
                        name: 'Test Pilot'
                    }
                });
            }

            const activeUserId = userId || user.id;

            const task = await prisma.task.create({
                data: {
                    title,
                    description,
                    distance: distance || 5.0,
                    speed: speed || 1.0,
                    color: color || '#ffffff',
                    userId: activeUserId
                }
            });

            // Emit to all clients via WebSocket
            io.emit('task-created', task);

            res.status(201).json(task);
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // PUT update task (e.g., status to "done" for the Supernova effect)
    app.put('/api/tasks/:id', async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const updateData = req.body;

            const task = await prisma.task.update({
                where: { id },
                data: updateData
            });

            // Emit to all clients via WebSocket
            io.emit('task-updated', task);

            res.json(task);
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // DELETE task
    app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;

            await prisma.task.delete({
                where: { id }
            });

            // Emit to all clients via WebSocket
            io.emit('task-deleted', id);

            res.status(204).send();
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
