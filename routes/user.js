const express = require('express');
const { signup, signIn } = require('../controler/user/auth');
const { aviableSlots, slotBooking } = require('../controler/user/bookings');
const { getUser } = require('../controler/user/getUserDeatiles');
const { showMovies, shows } = require('../controler/user/movies');
const { verifyUser } = require('../middlewares/auth');
const route = express.Router();

route.post('/signup', signup)
route.post('/signin', signIn);
route.get('/user-data', verifyUser, getUser);
route.get('/movies', showMovies);
route.get('/shows/:id', shows); 
route.get('/aviablesolts/:id', aviableSlots);
route.post('/booking-slot',verifyUser, slotBooking);

module.exports = route