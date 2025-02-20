const request = require('supertest');
const express = require('express');
const { findUsers } = require('../controler/admin/findUsers');
const connection = require('../config/db');

jest.mock('../config/db');

describe('findUsers Controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/find-users', findUsers);
  });

  test('should return 500 if there is a database error', async () => {
    connection.query.mockImplementationOnce((sql, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app).get('/find-users');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Database error');
  });

  test('should return 200 and list of users if query is successful', async () => {
    const mockUsers = [
      { id: 1, username: 'admin', email: 'admin@example.com' },
    ];

    connection.query.mockImplementationOnce((sql, callback) => {
      callback(null, mockUsers);
    });

    const response = await request(app).get('/find-users');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockUsers);
  });
});
