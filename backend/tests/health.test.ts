import app from '../../src/app';

describe('Health Check', () => {
  it('should return OK status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
  });
});
