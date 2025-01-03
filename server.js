const express = require('express');
const app = express();
app.disable('x-powered-by');
const path = require('path');
const connection = require('./src/database/db');

app.get('/', (req, res) => {
    connection.query('SELECT * FROM user', (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(result);
    });
});

app.get('/page1', (req, res) => {
    res.sendFile(path.join(__dirname, "src", "pages", "page1.html"), (err) => {
        if (err) {
            console.error('Error sending page1:', err);
            return res.status(500).send('Internal Server Error');
        }
    });
});

app.get('/page2', (req, res) => {
    res.sendFile(path.join(__dirname, "src", "pages", "page2.html"), (err) => {
        if (err) {
            console.error('Error sending page2:', err);
            return res.status(500).send('Internal Server Error');
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
