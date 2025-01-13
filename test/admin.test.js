const request = require('supertest');
const express = require('express');
const route = require('../routes/admin');
const { signin } = require('../controler/admin/auth');
const { findUsers } = require('../controler/admin/findUsers');
const { verifyAdmin } = require('../middlewares/auth');

jest.mock('../controler/admin/auth');
jest.mock('../controler/admin/findUsers');
jest.mock('../middlewares/auth');

describe('Admin Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(route); 
  });

  test('should call signin controller on POST /signin', async () => {
    signin.mockImplementation((req, res) => res.status(200).json({ message: 'Signin successful' }));

    const response = await request(app)
      .post('/signin')
      .send({ username: 'admin', password: 'password123' }); 

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Signin successful');
    expect(signin).toHaveBeenCalled();
  });

  test('should call findUsers controller on GET /find-users with valid admin authorization', async () => {
     
    findUsers.mockImplementation((req, res) => res.status(200).json({ users: [] }));

     
    verifyAdmin.mockImplementation((req, res, next) => next());

    const response = await request(app)
      .get('/find-users')
      .set('Authorization', 'Bearer valid_token');  

    expect(response.status).toBe(200);
    expect(response.body.users).toEqual([]);
    expect(findUsers).toHaveBeenCalled();
  });

  test('should return 401 for /find-users if no valid admin authorization', async () => {
    verifyAdmin.mockImplementation((req, res, next) => res.status(401).json({ message: 'Unauthorized' }));

    const response = await request(app)
      .get('/find-users')
      .set('Authorization', 'Bearer invalid_token'); 

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
    expect(verifyAdmin).toHaveBeenCalled();
  });
});
