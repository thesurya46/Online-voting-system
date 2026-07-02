import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import bcrypt from 'bcryptjs';

describe('Auth Controller', () => {
  beforeAll(async () => {
    // Setup: Create roles if they don't exist
    await prisma.role.upsert({
      where: { name: 'VOTER' },
      update: {},
      create: { name: 'VOTER' }
    });
  });

  afterEach(async () => {
    // Cleanup test data
    await prisma.user.deleteMany({
      where: { email: { contains: 'test' } }
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'SecurePass123!'
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
    });

    it('should reject invalid email', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'invalid-email',
        firstName: 'Test',
        lastName: 'User',
        password: 'SecurePass123!'
      });

      expect(response.status).toBe(400);
    });

    it('should reject weak password', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'weak'
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const voterRole = await prisma.role.findUnique({
        where: { name: 'VOTER' }
      });
      const hashedPassword = await bcrypt.hash('SecurePass123!', 12);

      await prisma.user.create({
        data: {
          email: 'testuser@example.com',
          firstName: 'Test',
          lastName: 'User',
          password: hashedPassword,
          roleId: voterRole!.id
        }
      });
    });

    it('should login successfully', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'testuser@example.com',
        password: 'SecurePass123!'
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('user');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'testuser@example.com',
        password: 'WrongPassword123!'
      });

      expect(response.status).toBe(401);
    });
  });
});
