const connection = require("../../config/db")

const showMovies = (req, res) => {
    connection.query(`SELECT * FROM movie`, (err, result) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'database error',
                error: err
            })
        }
        res.json({ success: true, data: result })
    })
}

const shows = (req, res) => {
    const movieId = req.params.id;
    connection.query(`SELECT * FROM shows WHERE movie_id = ?`,[movieId], (err, result) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'database error',
                error: err
            })
        }
        connection.query(`SELECT DISTINCT (movie_date) FROM shows`,(error, data)=>{
            if(error) {
                return res.status(500).send({
                    success: false,
                    message: 'database error',
                    error: err
                })
            }
            res.json({ success: true, data: result, dates: data });
        })
    })
    
}

module.exports = { showMovies, shows }