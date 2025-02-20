const connection = require("../../config/db")

const findUsers = (req, res) => {
    connection.query(`SELECT * FROM user`, (err, result)=>{
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'Database error',
                error: err,
            });
        }
        res.json({ success: true, data: result });
    })
}

module.exports = { findUsers }