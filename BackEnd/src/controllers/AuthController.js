import mysql from 'mysql2'
const dbConfig = require('../config/dbConfig');

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

exports.authenticate = (req, res) => {
    const { user_email, password } = req.body;

    if (!user_email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = 'SELECT * FROM authentication WHERE User-Email = ? AND Password = ?';
    connection.query(query, [user_email, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).json({ error: 'Internal server error' });
        }

        console.log('Query results:', results); // Debugging output

        if (results.length > 0) {
            res.status(200).json({ message: 'Authentication successful' });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
};
