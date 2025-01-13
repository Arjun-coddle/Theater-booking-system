const connection = require("../../config/db")
const jwt = require("jsonwebtoken");

const signup = (req, res) => {
    const { email, password, username } = req.body;
    connection.query('SELECT * FROM user WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                success: false,
                message: 'Database error',
                error: err,
            });
        }
        if (result.length){
            return res.status(409).send({
                success: false,
                message: 'This email already exist'
            })
        }

        connection.query( `INSERT INTO user (username, email, password, created_at, modify) VALUES (?, ?, ?, ?, ?)`,
        [username, email, password, new Date(), new Date()],(error, data) => {
            if(error){
                return res.status(500).send({
                    success: false,
                    message: 'Database error',
                    error: err,
                });
            }
            res.json({ success: true, data});
        })
    })
}

const signIn = (req, res) =>{
    const { email, password } = req.body;
    connection.query(`SELECT * FROM user WHERE email = ? AND password = ?`, [email, password], (err, result)=>{
        if(err){
            return res.status(500).send({
                success: false,
                message: 'Database error',
                error: err,
            });
        }
        if(result.length === 0){
            return res.status(401).send({
                success: false,
                message: 'User not found'
            });
        }
         const token = jwt.sign(
            {
                id: result[0].id,
                email: result[0].email,
                role : 'user'
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        const {id, username, email } = result[0];

        res.json({ success: true, data: {id, username, email}, token});

    }) 
}

module.exports = { signup, signIn };