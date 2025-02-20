const request = require('supertest');
const express = require('express');
const userRoute = require('../routes/user');

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mockToken'),
    verify: jest.fn((token, secret) => {
        if (token === 'userToken') return { role: 'user' };
        if (token === 'adminToken') return { role: 'admin' };
        throw new Error('Invalid token');
    }),
}));

describe('User Routes Tests', () => {
    const app = express();
    app.use(express.json());
    app.use('/api', userRoute);

    test('POST /api/signup should call signup controller', async () => {
        const res = await request(app).post('/api/signup').send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        });
        expect(res.status).toBe(409); 
    });

    test('POST /api/signin should call signIn controller', async () => {
        const res = await request(app).post('/api/signin').send({
            email: 'test@example.com',
            password: 'password123',
        });
        expect(res.status).toBe(200); 
    });

    test('GET /api/user-data should return user data when authorized', async () => {
        const res = await request(app)
            .get('/api/user-data')
            .set('Authorization', 'Bearer userToken');

        expect(res.status).toBe(200); 
    });

    test('GET /api/movies should return a list of movies', async () => {
        const res = await request(app).get('/api/movies');
        expect(res.status).toBe(200); 
        expect(Array.isArray(res.body)).toBe(false);
    });

    test('GET /api/shows/:id should return show details', async () => {
        const res = await request(app).get('/api/shows/1');
        expect(res.status).toBe(200);
    });

    test('GET /api/aviablesolts/:id should return available slots', async () => {
        const res = await request(app).get('/api/aviablesolts/1');
        expect(res.status).toBe(200); 
    });

});
