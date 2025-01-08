const request = require('supertest');
const express = require('express');
const idUser = require('../controler/getUserWithId'); 
const app = express();

app.use(idUser);

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

const connection = require('../config/db');

describe('POST /user/:id', () => {
  it('should return user data for a valid user id', async () => {
    const userId = 1;

    connection.query.mockImplementation((query, values, callback) => {
      if (values[0] === userId) {
        callback(null, [{ id: 1, name: 'arun' }]);
      }
    });

    const response = await request(app).post(`/user/${userId}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'arun' }]);
  });

  it('should return an error if the database query fails', async () => {
    const userId = 1;

    connection.query.mockImplementation((query, values, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app).post(`/user/${userId}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Database error' });
  });

  it('should return an empty array if no user is found', async () => {
    const userId = 999; 

    connection.query.mockImplementation((query, values, callback) => {
      callback(null, []);
    });

    const response = await request(app).post(`/user/${userId}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
