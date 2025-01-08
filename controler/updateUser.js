const express = require('express');
const updatedUser = express.Router();
const connection = require('../config/db');

updatedUser.put('/update/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, email, password, created_at, modify } = req.body;

  if (!username || !email || !password || !created_at || !modify) {
    return res.status(400).send({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  connection.query(
    'UPDATE user SET username = ?, email = ?, password = ?, created_at = ?, modify = ? WHERE id = ?',
    [username, email, password, created_at, modify, userId],
    (err, results) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: 'An error occurred while updating the user',
        });
      }
      res.json({ success: true, data: results });
    }
  );
});

module.exports = updatedUser;
