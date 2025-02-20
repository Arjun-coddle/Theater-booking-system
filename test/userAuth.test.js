const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('../config/db');

jest.mock('../config/db');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());

app.post('/signup', (req, res) => {
  const { email, password, username } = req.body;

  connection.query('SELECT * FROM user WHERE email = ?', [email], (err, result) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: 'Database error',
        error: err,
      });
    }

    if (result.length) {
      return res.status(409).send({
        success: false,
        message: 'This email already exists',
      });
    }

    connection.query(
      `INSERT INTO user (username, email, password, created_at, modify) VALUES (?, ?, ?, ?, ?)`,
      [username, email, password, new Date(), new Date()],
      (error, data) => {
        if (error) {
          return res.status(500).send({
            success: false,
            message: 'Database error',
            error: error,
          });
        }
        res.json({ success: true, data });
      }
    );
  });
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  connection.query(
    `SELECT * FROM user WHERE email = ? AND password = ?`,
    [email, password],
    (err, result) => {
      if (err) {
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
          role: 'user',
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      const { id, username, email } = result[0];
      res.json({ success: true, data: { id, username, email }, token });
    }
  );
});

describe('Authentication Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Sign-up', () => {
    test('should create a new user if the email is not taken', async () => {
      const mockUser = [];
      connection.query.mockImplementationOnce((sql, params, callback) => {
        callback(null, mockUser); 
      });

      connection.query.mockImplementationOnce((sql, params, callback) => {
        callback(null, { insertId: 1 });
      });

      const response = await request(app)
        .post('/signup')
        .send({ email: 'newuser@example.com', password: 'password123', username: 'newuser' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(connection.query).toHaveBeenCalledTimes(2);
    });

    test('should return 409 if email already exists', async () => {
      const mockUser = [{ email: 'existing@example.com' }];
      connection.query.mockImplementationOnce((sql, params, callback) => {
        callback(null, mockUser); 
      });

      const response = await request(app)
        .post('/signup')
        .send({ email: 'existing@example.com', password: 'password123', username: 'existing' });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('This email already exists');
    });

    test('should handle database errors', async () => {
      connection.query.mockImplementationOnce((sql, params, callback) => {
        callback(new Error('Database error'), null);
      });

      const response = await request(app)
        .post('/signup')
        .send({ email: 'newuser@example.com', password: 'password123', username: 'newuser' });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Database error');
    });
  });

  describe('Sign-in', () => {
    test('should return a token on successful sign-in', async () => {
      const mockUser = [{ id: 1, username: 'user1', email: 'user1@example.com' }];
      connection.query.mockImplementationOnce((sql, params, callback) => {
        callback(null, mockUser);
      });

      jwt.sign.mockReturnValue('mocked-jwt-token');

      const response = await request(app)
        .post('/signin')
        .send({ email: 'user1@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual({ id: 1, username: 'user1', email: 'user1@example.com' });
      expect(response.body.token).toBe('mocked-jwt-token');
    });

    test('should return 401 if user is not found', async () => {
      connection.query.mockImplementationOnce((sql, params, callback) => {
        callback(null, []); 
      });

      const response = await request(app)
        .post('/signin')
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    test('should handle database errors', async () => {
      connection.query.mockImplementationOnce((sql, params, callback) => {
        callback(new Error('Database error'), null);
      });

      const response = await request(app)
        .post('/signin')
        .send({ email: 'user1@example.com', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Database error');
    });
  });
});
