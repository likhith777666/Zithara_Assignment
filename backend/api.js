const express = require('express');
const cors = require('cors'); 
const client = require('./connection.js');
const app = express();
const PORT = 3300;

app.use(cors()); // Use cors middleware

app.listen(PORT, () => {
    console.log(`Server is now listening at port ${PORT}`);
});

client.connect(); // Establish database connection

app.get('/users', (req, res) => {
    client.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ error: 'Error fetching users' });
        } else {
            res.json(result.rows);
        }
    });
});

// Close database connection gracefully on process exit
process.on('exit', () => {
    client.end();
});

module.exports = app;
