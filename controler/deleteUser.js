const express = require('express');
const deleteUser = express.Router();
const connection = require('../config/db');

deleteUser.delete('/delete/:id', (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).send({
      success: false,
      message: 'Invalid ID',
    });
  }

  connection.query('DELETE FROM user WHERE id = ?', [userId], (err, result) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: 'An error occurred while deleting the user',
      });
    }
    res.json({ success: true, data: result });
  });
});

module.exports = deleteUser;
