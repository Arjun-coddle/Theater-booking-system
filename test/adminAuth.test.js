const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');

jest.mock('../config/db');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());

app.post('/admin/signin', (req, res) => {
  const { name, password } = req.body;
  connection.query(
    `SELECT * FROM admin WHERE name = ? and password = ?`,
    [name, password],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          success: false,
          message: 'Database error',
          error: err,
        });
      }

      if (result.length === 0) {
        return res.status(401).send({
          success: false,
          message: 'User not found',
        });
      }

      const token = jwt.sign(
        {
          id: result[0].id,
          email: result[0].email,
          role: 'admin',
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      const { id, username, email } = result[0];
      res.json({ success: true, data: { id, username, email }, token });
    }
  );
});

describe('Admin Signin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return a token on successful signin', async () => {
    const mockAdmin = [{ id: 1, username: 'admin1', email: 'admin1@example.com' }];
    connection.query.mockImplementationOnce((sql, params, callback) => {
      callback(null, mockAdmin);
    });

    jwt.sign.mockReturnValue('mocked-jwt-token');

    const response = await request(app)
      .post('/admin/signin')
      .send({ name: 'admin1', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      id: 1,
      username: 'admin1',
      email: 'admin1@example.com',
    });
    expect(response.body.token).toBe('mocked-jwt-token');
    expect(connection.query).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalled();
  });

  test('should return 401 if user is not found', async () => {
    connection.query.mockImplementationOnce((sql, params, callback) => {
      callback(null, []);
    });

    const response = await request(app)
      .post('/admin/signin')
      .send({ name: 'nonexistent', password: 'password123' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('User not found');
    expect(connection.query).toHaveBeenCalled();
  });

  test('should handle database errors', async () => {
    connection.query.mockImplementationOnce((sql, params, callback) => {
      callback(new Error('Database connection failed'), null);
    });

    const response = await request(app)
      .post('/admin/signin')
      .send({ name: 'admin1', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Database error');
    expect(response.body.error).toBeDefined();
    expect(connection.query).toHaveBeenCalled();
  });
});
