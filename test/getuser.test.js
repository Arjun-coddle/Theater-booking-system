const request = require('supertest');
const express = require('express');
const mysql = require('mysql2');
const { user } = require('../controler/getuser');

const app = express();
app.get('/users', user); 

jest.mock('mysql2', () => {
  return {
    createConnection: jest.fn().mockReturnValue({
      query: jest.fn((query, callback) => {
        if (query === 'SELECT * FROM user') {
          callback(null, [{ id: 1, name: 'John Doe', email: 'johndoe@example.com' }]);
        } else {
          callback(new Error('Query not recognized'));
        }
      }),
      connect: jest.fn((callback) => callback(null)),
    }),
  };
});

describe('User Controller', () => {
  it('should return users successfully', async () => {
    const response = await request(app).get('/users');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'John Doe', email: 'johndoe@example.com' }]);
  });

  it('should handle database errors gracefully', async () => {
    const mockConnection = mysql.createConnection();
    
    mockConnection.query.mockImplementationOnce((query, callback) => {
      callback(new Error('Database error'));
    });

    const response = await request(app).get('/users');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Database error' });
  });
});
