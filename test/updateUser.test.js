const request = require('supertest');
const express = require('express');
const app = express();
const connection = require('../config/db');
const { updateUser } = require('../controler/updateUser');

jest.mock('../config/db');

app.use(express.json()); 
app.put('/user/update/:id', updateUser);

test('should return 400 if any required field is missing', async () => {
  const res = await request(app)
    .put('/user/update/1')
    .send({ username: 'newuser', email: 'new@example.com' });

  expect(res.status).toBe(400);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toBe('Please provide all required fields');
});

test('should update user successfully', async () => {
  const mockUpdateResult = { affectedRows: 1 }; 
  connection.query.mockImplementationOnce((query, params, callback) => {
    callback(null, mockUpdateResult); 
  });

  const res = await request(app)
    .put('/user/update/1')
    .send({
      username: 'updateduser',
      email: 'updated@example.com',
      password: 'newpassword',
      created_at: '2025-01-01',
      modify: '2025-01-01',
    });

  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data.affectedRows).toBe(1); 
});

test('should return 500 if there is a database error', async () => {
  const mockDbError = new Error('Database error');
  connection.query.mockImplementationOnce((query, params, callback) => {
    callback(mockDbError, null); 
  });

  const res = await request(app)
    .put('/user/update/1')
    .send({
      username: 'updateduser',
      email: 'updated@example.com',
      password: 'newpassword',
      created_at: '2025-01-01',
      modify: '2025-01-01',
    });

  expect(res.status).toBe(500);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toBe('An error occurred while updating the user');
  expect(res.body.error).toBeDefined();
});

test('should return 404 if no user is found to update', async () => {
  const mockNoUserFoundResult = { affectedRows: 0 }; 
  connection.query.mockImplementationOnce((query, params, callback) => {
    callback(null, mockNoUserFoundResult); 
  });

  const res = await request(app)
    .put('/user/update/999') 
    .send({
      username: 'updateduser',
      email: 'updated@example.com',
      password: 'newpassword',
      created_at: '2025-01-01',
      modify: '2025-01-01',
    });
});
