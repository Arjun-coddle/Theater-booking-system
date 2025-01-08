const request = require('supertest');
const express = require('express');
const deleteUser = require('../controler/deleteUser');
const app = express();

app.use(deleteUser);

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

const connection = require('../config/db');

describe('DELETE /delete/:id', () => {
  it('should delete the user and return success', async () => {
    const userId = 1;

    connection.query.mockImplementation((query, values, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app).delete(`/delete/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.affectedRows).toBe(1);
  });

  it('should return an error if the ID is invalid', async () => {
    const invalidUserId = 'invalid_id';

    const response = await request(app).delete(`/delete/${invalidUserId}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid ID');
  });

  it('should return an error if the database query fails', async () => {
    const userId = 1;

    connection.query.mockImplementation((query, values, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app).delete(`/delete/${userId}`);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('An error occurred while deleting the user');
  });
});
