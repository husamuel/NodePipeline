const request = require('supertest');
const app = require('../src/index');

describe('GET /health', () => {
  it('should respond with status 200 and a message', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
