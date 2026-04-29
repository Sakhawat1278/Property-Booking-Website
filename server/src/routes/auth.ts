import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  role: z.enum(['ADMIN', 'OWNER', 'BUILDER', 'USER']).default('USER'),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  address: z.string().optional(),
  licenseNumber: z.string().optional(),
  website: z.string().optional(),
  experience: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password, name, role, phone, businessName, address, licenseNumber, website, experience } = registerSchema.parse(request.body);

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply.status(400).send({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
          phone,
          businessName,
          address,
          licenseNumber,
          website,
          experience
        },
      });

      // Generate token
      const token = fastify.jwt.sign({ id: user.id, email: user.email, role: user.role });

      return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Invalid input', errors: error.issues });
      }
      return reply.status(500).send({ message: 'Internal server error', error: (error as Error).message });
    }
  });

  // Login
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email, password } = loginSchema.parse(request.body);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.status(401).send({ message: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return reply.status(401).send({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = fastify.jwt.sign({ id: user.id, email: user.email, role: user.role });

      return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Invalid input', errors: error.issues });
      }
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // Me (Verify token)
  fastify.get('/me', {
    preHandler: [fastify.authenticate]
  }, async (request) => {
    return request.user;
  });
}
