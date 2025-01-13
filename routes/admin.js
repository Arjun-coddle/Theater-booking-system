const express = require('express');
const { signin } = require('../controler/admin/auth');
const { findUsers } = require('../controler/admin/findUsers');
const { verifyAdmin } = require('../middlewares/auth');
const route = express.Router();

route.post('/signin', signin);
route.get('/find-users', verifyAdmin, findUsers);

module.exports = route