const jwt = require('jsonwebtoken');
const { verifyUser, verifyAdmin } = require('../middlewares/auth');
const request = require('supertest');
const express = require('express');

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mockToken'),
    verify: jest.fn((token, secret) => {
        if (token === 'userToken') return { role: 'user' };
        if (token === 'adminToken') return { role: 'admin' };
        throw new Error('Invalid token');
    }),
}));

describe('Middleware Authentication Tests', () => {
    const app = express();

    app.get('/user-data', verifyUser, (req, res) => {
        res.status(200).send({ success: true, message: 'User access granted' });
    });

    app.get('/find-users', verifyAdmin, (req, res) => {
        res.status(200).send({ success: true, message: 'Admin access granted' });
    });

    test('verifyUser grants access with valid user token', async () => {
        const res = await request(app)
            .get('/user-data')
            .set('Authorization', 'Bearer userToken');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('User access granted');
    });

    test('verifyUser denies access with invalid token', async () => {
        const res = await request(app)
            .get('/user-data')
            .set('Authorization', 'Bearer invalidToken');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Unauthorized');
    });

    test('verifyAdmin grants access with valid admin token', async () => {
        const res = await request(app)
            .get('/find-users')
            .set('Authorization', 'Bearer adminToken');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Admin access granted');
    });

    test('verifyAdmin denies access with user token', async () => {
        const res = await request(app)
            .get('/find-users')
            .set('Authorization', 'Bearer userToken');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Unauthorized');
    });

    test('verifyUser handles missing token', async () => {
        const res = await request(app).get('/user-data');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Unauthorized');
    });

    test('verifyAdmin handles missing token', async () => {
        const res = await request(app).get('/find-users');

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Unauthorized');
    });
});
