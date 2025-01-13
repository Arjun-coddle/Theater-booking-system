const connection = require("../../config/db")

const getUser = (req, res) => {
    connection.query(`SELECT * FROM user WHERE id=?`, [req.user.id], (err, result) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'Database error',
                error: err,
            });
        }
        res.json({ success: true, data: result[0] });
    })
}

module.exports = { getUser }