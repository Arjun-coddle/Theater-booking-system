const express = require('express');
const idUser = express.Router();
const connection = require('../config/db');

idUser.post('/user/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  connection.query('SELECT * FROM user WHERE id=?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = idUser;
