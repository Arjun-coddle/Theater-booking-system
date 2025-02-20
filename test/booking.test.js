const request = require('supertest');
const express = require('express');
const { aviableSlots, slotBooking } = require('../controler/user/bookings');
const connection = require('../config/db');

jest.mock('../config/db');

const app = express();
app.use(express.json());

app.get('/slots/:id', aviableSlots);
app.post('/book', (req, res, next) => {
  req.user = { id: 1 }; 
  next();
}, slotBooking);

describe('Booking Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('aviableSlots', () => {
    test('should return available slots for a screen', async () => {
      const mockData = [
        { id: 1, screen_id: 1, isAvailable: true },
        { id: 2, screen_id: 1, isAvailable: false },
      ];
      connection.query.mockImplementationOnce((sql, params, callback) => {
        callback(null, mockData);
      });

      const response = await request(app).get('/slots/1');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockData);
    });

    test('should handle database error in aviableSlots', async () => {
      connection.query.mockImplementationOnce((sql, params, callback) => {
        callback(new Error('Database error'), null);
      });

      const response = await request(app).get('/slots/1');
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('database error');
    });
  });

  describe('slotBooking', () => {
    test('should book selected seats successfully', async () => {
      const mockSeatData = [
        { id: 1, screen_id: 1 },
        { id: 2, screen_id: 1 },
      ];

      connection.query
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, mockSeatData);
        })
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { insertId: 1 });
        })
        .mockImplementation((sql, params, callback) => {
          callback(null); 
        });

      const response = await request(app)
        .post('/book')
        .send({ selectedSeats: [1, 2], showId: 1, paymentId: 123 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Seats successfully booked');
    });

    test('should handle error when some seats are unavailable', async () => {
      const mockSeatData = [{ id: 1, screen_id: 1 }]; 

      connection.query.mockImplementationOnce((sql, params, callback) => {
        callback(null, mockSeatData);
      });

      const response = await request(app)
        .post('/book')
        .send({ selectedSeats: [1, 2], showId: 1, paymentId: 123 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Some of the seats are not available');
    });

    test('should handle database error in slotBooking', async () => {
      connection.query.mockImplementationOnce((sql, params, callback) => {
        callback(new Error('Database error'), null);
      });

      const response = await request(app)
        .post('/book')
        .send({ selectedSeats: [1, 2], showId: 1, paymentId: 123 });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Database error');
    });
  });
});
