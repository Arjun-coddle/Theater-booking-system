const request = require('supertest');
const express = require('express');
const createUser = require('../controler/createUser');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(createUser);

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

const connection = require('../config/db');

describe('post /create', () => {
  it('should create a user and return success', async () => {
    const userData = {
      id: 1,
      username: 'john_doe',
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      created_at: '2025-01-07',
      modify: '2025-01-07',
    };

    connection.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1, insertId: 1 });
    });

    const response = await request(app).post('/create').send(userData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.affectedRows).toBe(1);
    expect(response.body.data.insertId).toBe(1);
  });

  it('should return an error if fields are missing', async () => {
    const incompleteUserData = {
      username: 'john_doe',
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      created_at: '2025-01-07',
      modify: '2025-01-07',
    };

    const response = await request(app).post('/create').send(incompleteUserData);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Please fill all fields');
  });

  it('should return an error if the database query fails', async () => {
    const userData = {
      id: 1,
      username: 'john_doe',
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      created_at: '2025-01-07',
      modify: '2025-01-07',
    };

    connection.query.mockImplementation((query, values, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app).post('/create').send(userData);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Database error');
  });
});
