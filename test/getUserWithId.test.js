const request = require('supertest');
const express = require('express');
const app = express();
const connection = require('../config/db');
const { idUser } = require('../controler/getUserWithId');

jest.mock('../config/db');

app.get('/user/:id', idUser);

test('should return user data when user is found', async () => {
  const mockResponse = [{ id: 1, username: 'testuser', email: 'test@example.com' }];
  connection.query.mockImplementation((query, params, callback) => {
    callback(null, mockResponse); 
  });

  const res = await request(app).get('/user/1'); 

  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data.username).toBe('testuser');
});

test('should return 404 if user is not found', async () => {
  const mockResponse = []; 
  connection.query.mockImplementation((query, params, callback) => {
    callback(null, mockResponse);
  });

  const res = await request(app).get('/user/999'); 

  expect(res.status).toBe(404);
  expect(res.body.error).toBe('User not found');
});

test('should return 500 if there is a database query error', async () => {
  const mockError = new Error('Database query error');
  connection.query.mockImplementationOnce((query, params, callback) => {
    callback(mockError, null);
  });

  const res = await request(app).get('/user/1');

  expect(res.status).toBe(500);
  expect(res.body.error).toBe('Failed to retrieve user from the database');
});
