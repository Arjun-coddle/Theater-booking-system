const request = require('supertest');
const express = require('express');
const { getUser } = require('../controler/user/getUserDeatiles');
const connection = require('../config/db');

jest.mock('../config/db');

describe('getUser Controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    app.use((req, res, next) => {
      req.user = { id: 1 }; 
      next();
    });

    app.get('/get-user', getUser);
  });

  test('should return 500 if there is a database error', async () => {
    connection.query.mockImplementationOnce((sql, params, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app).get('/get-user');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Database error');
    expect(response.body.error).toBeDefined();
  });

  test('should return 200 and user data if query is successful', async () => {
    const mockUser = { id: 1, username: 'admin', email: 'admin@example.com' };

    connection.query.mockImplementationOnce((sql, params, callback) => {
      callback(null, [mockUser]);
    });

    const response = await request(app).get('/get-user');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockUser);
  });
});
