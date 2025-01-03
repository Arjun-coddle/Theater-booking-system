const express = require('express');
const page1 = express();
const path = require('path');

page1.disable('x-powered-by');

page1.get('/page1', (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "page1.html"), (err) => {
        if (err) {
            console.error('Error sending page1:', err);
            return res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = page1;
