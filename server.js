const express = require('express');
const app = express();
app.disable('x-powered-by');
const connection = require('./config/db');
const page1 = require('./routes/page1.js');
const page2 = require('./routes/page2.js');

app.get('/', (req, res) => {
    connection.query('SELECT * FROM user', (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(result);
    });
});

app.use('/', page1);

app.use('/', page2);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
