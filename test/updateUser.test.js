const request = require('supertest');
const express = require('express');
const updatedUser = require('../controler/updateUser'); 
require('dotenv').config();
const app = express();

app.use(express.json()); 
app.use(updatedUser);

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

const connection = require('../config/db');

describe('PUT /update/:id', () => {
  it('should update the user and return success', async () => {
    const userId = 1;
    const userData = {
      username: 'john_updated',
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      created_at: '2025-01-07',
      modify: '2025-01-07',
    };

    connection.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).put(`/update/${userId}`).send(userData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.affectedRows).toBe(1);
  });

  it('should return an error if required fields are missing', async () => {
    const userId = 1;
    const incompleteUserData = {
      username: 'john_updated',
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      created_at: '2025-01-07',
    };

    const response = await request(app).put(`/update/${userId}`).send(incompleteUserData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Please provide all required fields');
  });

  it('should return an error if the database query fails', async () => {
    const userId = 1;
    const userData = {
      username: 'john_updated',
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      created_at: '2025-01-07',
      modify: '2025-01-07',
    };

    connection.query.mockImplementation((query, values, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app).put(`/update/${userId}`).send(userData);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('An error occurred while updating the user');
  });
});
