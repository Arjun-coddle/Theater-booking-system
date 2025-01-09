const connection = require('../config/db');

const idUser = (req, res) => {
  const userId = parseInt(req.params.id);

  if (!connection) {
    return res.status(500).json({ error: 'Database connection not established' });
  }

  connection.query('SELECT * FROM user WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Failed to retrieve user from the database' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, data: results[0] });
  });
};

module.exports = { idUser };