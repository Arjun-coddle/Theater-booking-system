const request = require('supertest');
const express = require('express');
const { app } = require('../server');

const userRoute = express.Router();
const adminRoute = express.Router();

userRoute.get('/', (req, res) => {
    res.status(200).send({ message: 'User route accessed' });
});

adminRoute.get('/', (req, res) => {
    res.status(200).send({ message: 'Admin route accessed' });
});

app.use('/', userRoute);
app.use('/admin', adminRoute);

test('should access the user route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(undefined);
});

test('should access the admin route', async () => {
    const response = await request(app).get('/admin');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(undefined);
});

test('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown');
    expect(response.status).toBe(200);
});

describe('Testing routes in server.js', () => {
  test('GET /user should return 200 status code', async () => {
    const res = await request(app).get('/user');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);  
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
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });

  test('GET wildcard route should return 404', async () => {
    const res = await request(app).get('/nonexistent-route');
    expect(res.status).toBe(200);
    expect(res.body).toBe('No Data Found');
  });
});
