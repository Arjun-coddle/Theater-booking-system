const request = require('supertest');
const express = require('express');
const app = express();
const connection = require('../config/db');
const { deleteUser } = require('../controler/delete');

jest.mock('../config/db');

app.delete('/delete/:id', deleteUser);

test('should delete user and return success', async () => {
  const mockResponse = { affectedRows: 1 }; 
  connection.query.mockImplementation((query, params, callback) => {
    callback(null, mockResponse);
  });

  const res = await request(app).delete('/delete/1'); 

  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.message).toBe('User deleted successfully');
});

test('should return 404 if user not found', async () => {
  const mockResponse = { affectedRows: 0 }; 
  connection.query.mockImplementation((query, params, callback) => {
    callback(null, mockResponse);
  });

  const res = await request(app).delete('/delete/1');

  expect(res.status).toBe(404);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toBe('User not found');
});

test('should return 400 for invalid user ID', async () => {
  const res = await request(app).delete('/delete/abc'); 

  expect(res.status).toBe(400);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toBe('Invalid user ID');
});

test('should return 500 if there is a database error', async () => {
  const mockError = new Error('Database error');
  connection.query.mockImplementation((query, params, callback) => {
    callback(mockError, null);
  });

  const res = await request(app).delete('/delete/1');

  expect(res.status).toBe(500);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toBe('An error occurred while deleting the user');
});
