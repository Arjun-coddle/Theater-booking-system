const express = require('express');
const app = express();
app.disable('x-powered-by');
const path = require('path');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'assignment2'
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1); 
    }
    console.log('Connected to the database!');
});

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
    res.sendFile(path.join(__dirname, "pages", "page1.html"), (err) => {
        if (err) {
            console.error('Error sending page1:', err);
            return res.status(500).send('Internal Server Error');
        }
    });
});

app.get('/page2', (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "page2.html"), (err) => {
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
