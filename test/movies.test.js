const request = require('supertest');
const express = require('express');
const { showMovies, shows } = require('../controler/user/movies'); 
const connection = require('../config/db');

jest.mock('../config/db');

describe('Movie Controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/movies', showMovies);
    app.get('/movies/:id/shows', shows);
  });

  describe('showMovies', () => {
    test('should return 500 if there is a database error', async () => {
      connection.query.mockImplementationOnce((sql, callback) => {
        callback(new Error('Database error'), null);
      });

      const response = await request(app).get('/movies');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('database error');
      expect(response.body.error).toBeDefined();
    });

    test('should return 200 and movie data if query is successful', async () => {
      const mockMovies = [
        { id: 1, title: 'Movie 1', genre: 'Action' },
        { id: 2, title: 'Movie 2', genre: 'Comedy' },
      ];

      connection.query.mockImplementationOnce((sql, callback) => {
        callback(null, mockMovies);
      });

      const response = await request(app).get('/movies');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockMovies);
    });
  });

  describe('shows', () => {
    test('should return 500 if there is a database error in the first query', async () => {
      connection.query.mockImplementationOnce((sql, params, callback) => {
        callback(new Error('Database error'), null);
      });

      const response = await request(app).get('/movies/1/shows');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('database error');
      expect(response.body.error).toBeDefined();
    });

    test('should return 500 if there is a database error in the second query', async () => {
      connection.query
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, [{ id: 1, movie_id: 1, time: '12:00 PM' }]);
        })
        .mockImplementationOnce((sql, callback) => {
          callback(new Error('Database error'), null);
        });

      const response = await request(app).get('/movies/1/shows');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('database error');
      expect(response.body.error).toBeDefined();
    });

    test('should return 200 and show data if both queries are successful', async () => {
      const mockShows = [
        { id: 1, movie_id: 1, time: '12:00 PM' },
        { id: 2, movie_id: 1, time: '3:00 PM' },
      ];
      const mockDates = [{ movie_date: '2025-01-15' }];

      connection.query
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, mockShows);
        })
        .mockImplementationOnce((sql, callback) => {
          callback(null, mockDates); 
        });

      const response = await request(app).get('/movies/1/shows');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockShows);
      expect(response.body.dates).toEqual(mockDates);
    });
  });
});
