const connection = require('../config/db');

const createUser = (req, res) => {
  const { id, username, email, password, created_at, modify } = req.body;

  if (!id || !username || !email || !password || !created_at || !modify) {
    return res.status(400).send({
      success: false,
      message: 'Please fill all fields',
    });
  }

  connection.query(
    `INSERT INTO user (id, username, email, password, created_at, \`modify\`) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, username, email, password, created_at, modify],
    (err, results) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: 'Database error',
          error: err,
        });
      }
      res.json({ success: true, data: results });
    }
  );
};

module.exports = { createUser };
