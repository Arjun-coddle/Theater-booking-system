const connection = require("../config/db");

const user = (req, res) => {
  connection.query('SELECT * FROM user', (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(result);
  });
};

module.exports = { user };
