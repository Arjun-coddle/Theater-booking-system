const connection = require('../config/db');

const deleteUser = (req, res) => {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
        return res.status(400).send({
            success: false,
            message: 'Invalid user ID',
        });
    }

    connection.query(`DELETE FROM user WHERE id = ?`, [userId], (err, result) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'An error occurred while deleting the user',
                error: err,
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }
        res.json({ success: true, message: 'User deleted successfully', data: result });
    });
};

module.exports = { deleteUser };