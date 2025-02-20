const request = require('supertest');
const express = require('express');
const app = express();
const connection = require('../config/db');
const { createUser } = require('../controler/createUser');
require('dotenv').config();

jest.mock('../config/db');

app.use(express.json());
app.post('/create', createUser);

test('should create a user and return success', async () => {
  const mockResponse = { insertId: 1 }; 
  connection.query.mockImplementation((query, params, callback) => {
    callback(null, mockResponse);
  });

  const res = await request(app)
    .post('/create')
    .send({
      id: 1,
      username: 'testuser',
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      created_at: '2025-01-01 12:00:00',
      modify: '2025-01-01 12:00:00',
    });

  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data.insertId).toBe(1); 
});

test('should return 400 if required fields are missing', async () => {
  const res = await request(app)
    .post('/create')
    .send({
      id: 1,
      username: 'testuser',
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      created_at: '2025-01-01 12:00:00',
    });

  expect(res.status).toBe(400);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toBe('Please fill all fields');
});

test('should return 500 if there is a database error', async () => {
  const mockError = new Error('Database error');
  connection.query.mockImplementation((query, params, callback) => {
    callback(mockError, null);
  });

  const res = await request(app)
    .post('/create')
    .send({
      id: 1,
      username: 'testuser',
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      created_at: '2025-01-01 12:00:00',
      modify: '2025-01-01 12:00:00',
    });

  expect(res.status).toBe(500);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toBe('Database error');
});
