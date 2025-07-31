const request = require('supertest');
const app = require('../src/index');

describe('Users API', () => {
  it('should return empty users array initially', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.users).toEqual([]);
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Alice' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Alice');
  });

  it('should return 400 if name is missing', async () => {
    const res = await request(app).post('/users').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].msg).toBe('Name is required');
  });
});
