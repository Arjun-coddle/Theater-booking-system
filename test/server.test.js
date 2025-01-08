const request = require('supertest');
const { app } = require('../server');
require('dotenv').config();

jest.mock('../controler/createUser.js', () => jest.fn((req, res) => res.status(201).send({ success: true, message: 'User created successfully' })));
jest.mock('../controler/deleteUser.js', () => jest.fn((req, res) => res.status(200).send({ success: true, message: 'User deleted successfully' })));
jest.mock('../controler/getUserWithId.js', () => jest.fn((req, res) => res.status(200).send({ success: true, user: { id: 1, name: 'Test User' } })));
jest.mock('../controler/getuser.js', () => ({
    user: jest.fn((req, res) => res.status(200).send([{ id: 1, name: 'Test User' }])),
}));
jest.mock('../controler/updateUser.js', () => jest.fn((req, res) => res.status(200).send({ success: true, message: 'User updated successfully' })));

describe('Express App Routes', () => {
    it('should return all users on GET /user', async () => {
        const response = await request(app).get('/user');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, name: 'Test User' }]);
    });

    it('should return a user by ID on POST /user/:id', async () => {
        const response = await request(app).post('/user/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            user: { id: 1, name: 'Test User' },
        });
    });

    it('should create a user on POST /create', async () => {
        const response = await request(app).post('/create').send({
            id: 2,
            username: 'NewUser',
            email: process.env.USER_EMAIL,
            password: process.env.USER_PASSWORD
        });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            success: true,
            message: 'User created successfully',
        });
    });

    it('should update a user on PUT /update/:id', async () => {
        const response = await request(app).put('/update/1').send({
            username: 'UpdatedUser',
            email: process.env.USER_EMAIL,
            password: process.env.USER_PASSWORD
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            message: 'User updated successfully',
        });
    });

    it('should delete a user on DELETE /delete/:id', async () => {
        const response = await request(app).delete('/delete/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            message: 'User deleted successfully',
        });
    });

    it('should return "No Data Found" for unknown routes', async () => {
        const response = await request(app).get('/unknownRoute');
        expect(response.status).toBe(200);
        expect(response.body).toEqual("No Data Found");
    });
});
