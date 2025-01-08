const request = require('supertest');
const express = require('express');
const { user } = require('../controler/getuser'); 

jest.mock('../config/db', () => ({
  query: jest.fn((query, callback) => {
    if (query === 'SELECT * FROM users') {
      callback(null, [{ id: 1, name: 'Test User' }]);
    } else {
      callback(new Error('Query error'));
    }
  }),
}));

const app = express();
app.use(express.json());
app.use('/', user);

describe('User Router', () => {
  it('should return all users on GET /user', async () => {
    const response = await request(app).get('/user');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'Test User' }]);
  });

  it('should handle database connection error', async () => {
    const mockConnection = require('../config/db');
    mockConnection.query.mockImplementationOnce((query, callback) => {
      callback(new Error('Database connection not established'));
    });

    const response = await request(app).get('/user');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'An internal server error occurred.',
    });
  });

  it('should handle internal server errors', async () => {
    const mockConnection = require('../config/db');
    mockConnection.query.mockImplementationOnce((query, callback) => {
      callback(new Error('Query error'));
    });

    const response = await request(app).get('/user');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'An internal server error occurred.',
    });
  });
});
