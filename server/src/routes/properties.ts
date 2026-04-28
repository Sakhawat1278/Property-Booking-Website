import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function propertyRoutes(fastify: FastifyInstance) {
  // GET all properties
  fastify.get('/', async (request, reply) => {
    try {
      const properties = await prisma.property.findMany({
        include: {
          owner: {
            select: {
              name: true,
              businessName: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return properties;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Error fetching properties' });
    }
  });

  // GET single property by slug
  fastify.get('/:slug', async (request: any, reply) => {
    const { slug } = request.params;
    try {
      const property = await prisma.property.findUnique({
        where: { slug },
        include: {
          owner: {
            select: {
              name: true,
              businessName: true,
              phone: true,
              email: true,
              avatar: true
            }
          }
        }
      });

      if (!property) {
        return reply.status(404).send({ message: 'Property not found' });
      }

      return property;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Error fetching property details' });
    }
  });

  // POST create property (Protected - simplified for now)
  fastify.post('/', async (request: any, reply) => {
    // In a real app, we'd get ownerId from JWT
    const propertyData = request.body;
    try {
      const property = await prisma.property.create({
        data: propertyData
      });
      return property;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Error creating property' });
    }
  });
}
