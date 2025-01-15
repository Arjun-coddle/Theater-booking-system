const connection = require("../../config/db")

const aviableSlots = (req, res) => {
    const screenId = req.params.id;
    connection.query(`SELECT 
    seat.*,
    CASE 
        WHEN EXISTS (
            SELECT 1
            FROM bookedseat bs
            INNER JOIN booking b ON bs.booking_id = b.id
            WHERE bs.seat_id = seat.id
            ) THEN FALSE
            ELSE TRUE
            END AS isAvailable
            FROM seat WHERE seat.screen_id = ?
            `, [screenId], (err, result) => {
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

const slotBooking = (req, res) => {
    const { selectedSeats, showId, paymentId } = req.body;
    const userId = req.user.id;

    connection.query(`SELECT * FROM seat WHERE id IN (?)`, [selectedSeats], (err, result) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'Database error',
                error: err
            });
        }

        if (result.length !== selectedSeats.length) {
            return res.status(400).send({
                success: false,
                message: 'Some of the seats are not available'
            });
        }

        connection.query(`INSERT INTO booking (user_id, show_id, payment_id, booking_time, modify) VALUES (?,?,?,?,?)`, [userId, showId, paymentId, new Date(), new Date()], (err, result) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Database error while inserting booking',
                    error: err
                });
            }

            const bookingId = result.insertId;
            const seatQueries = selectedSeats.map(seat => {
                return new Promise((resolve, reject) => {
                    connection.query(`INSERT INTO bookedSeat (booking_id, seat_id) VALUES (?, ?)`, [bookingId, seat], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            });

            Promise.all(seatQueries)
                .then(() => {
                    return res.status(200).send({
                        success: true,
                        message: 'Seats successfully booked'
                    });
                })
                .catch(err => {
                    return res.status(500).send({
                        success: false,
                        message: 'Error while booking seats',
                        error: err
                    });
                });
        });
    });
};


module.exports = { aviableSlots, slotBooking }
