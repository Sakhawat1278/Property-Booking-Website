import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { prisma } from './prisma';
import authRoutes from './routes/auth';

const fastify = Fastify({
  logger: true
});

// Authentication Decorator
fastify.decorate("authenticate", async function(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
  }
}

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: true
    });

    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET || 'nestory-super-secret-key-2026'
    });

    // Register Routes
    await fastify.register(authRoutes, { prefix: '/api/auth' });
    await fastify.register(require('./routes/properties'), { prefix: '/api/properties' });

    // Root route
    fastify.get('/', async () => {
      return { status: 'Nestory API is running', version: '2.0.0' };
    });

    // Health check with Prisma
    fastify.get('/health', async () => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        return { database: 'Connected' };
      } catch (e) {
        return { database: 'Disconnected', error: (e as Error).message };
      }
    });

    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
