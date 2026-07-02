import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/config/database';
import jwt from 'jsonwebtoken';
import { config } from '../../src/config/env';

describe('Election Controller', () => {
  let authToken: string;
  let electionAdminId: string;
  let electionId: string;

  beforeAll(async () => {
    // Setup: Create roles
    const electionAdminRole = await prisma.role.upsert({
      where: { name: 'ELECTION_ADMIN' },
      update: {},
      create: { name: 'ELECTION_ADMIN' }
    });

    // Create election admin user
    const electionAdmin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        firstName: 'Election',
        lastName: 'Admin',
        password: 'hashed_password',
        roleId: electionAdminRole.id
      }
    });

    // Create ElectionAdmin profile
    const adminProfile = await prisma.electionAdmin.create({
      data: { userId: electionAdmin.id }
    });

    electionAdminId = adminProfile.id;

    // Generate JWT token
    authToken = jwt.sign(
      { userId: electionAdmin.id, email: electionAdmin.email, roleId: electionAdminRole.id },
      config.jwt_access_secret,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await prisma.election.deleteMany({});
    await prisma.electionAdmin.deleteMany({});
    await prisma.user.deleteMany({});
  });

  describe('POST /api/elections', () => {
    it('should create election', async () => {
      const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

      const response = await request(app)
        .post('/api/elections')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Election',
          description: 'Test Description',
          startDate,
          endDate
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      electionId = response.body.data.id;
    });
  });

  describe('GET /api/elections', () => {
    it('should list elections', async () => {
      const response = await request(app).get('/api/elections');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('elections');
    });
  });
});
