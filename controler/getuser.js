const express = require('express');
const user = express.Router();
const connection = require('../config/db');

user.use((req, res, next) => {
  if (!connection) {
    return res.status(500).json({ error: 'Database connection not established.' });
  }
  next();
});

user.get('/user', (req, res, next) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(200).json(results);
  });
});

user.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An internal server error occurred.' });
});

module.exports = { user, connection };
