const connection = require("../../config/db");
const jwt = require('jsonwebtoken');

const signin = (req, res) => {
    const { name, password } = req.body;
    connection.query(`SELECT * FROM admin WHERE name = ? and password = ?`, [name, password], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: 'Database error',
                error: err,
            });
        }
        if (result.length === 0) {
            return res.status(401).send({
                success: false,
                message: 'User not found'
            });
        }
        const token = jwt.sign(
            {
                id: result[0].id,
                email: result[0].email,
                role: 'admin'
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        const { id, username, email } = result[0];
        res.json({ success: true, data: { id, username, email }, token });
    })
}

module.exports = { signin }