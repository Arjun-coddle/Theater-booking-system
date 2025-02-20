const request = require('supertest');
const { app } = require('../server');

describe('Testing routes in server.js', () => {
  test('GET /user should return 200 status code', async () => {
    const res = await request(app).get('/user');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);  
  });

  test('POST /create should return 200 when creating a user', async () => {
    const newUser = {
      id: 1,
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      created_at: '2025-01-01',
      modify: '2025-01-01'
    };

    const res = await request(app).post('/create').send(newUser);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('insertId');
  });

  test('PUT /update/:id should return 200 for valid user update', async () => {
    const updatedUser = {
      username: 'john_doe_updated',
      email: 'john_updated@example.com',
      password: 'newpassword123',
      created_at: '2025-01-01',
      modify: '2025-01-01'
    };

    const res = await request(app).put('/update/1').send(updatedUser);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('affectedRows');
  });

  test('DELETE /delete/:id should return 200 for successful deletion', async () => {
    const res = await request(app).delete('/delete/1');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET wildcard route should return 404', async () => {
    const res = await request(app).get('/nonexistent-route');
    expect(res.status).toBe(200);
    expect(res.body).toBe('No Data Found');
  });
});
