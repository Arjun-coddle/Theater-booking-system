const express = require('express');
const page2 = express();
const path = require('path');

page2.disable('x-powered-by');

page2.get('/page2', (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "page2.html"), (err) => {
        if (err) {
            console.error('Error sending page1:', err);
            return res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = page2;