const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token' });

        req.userId = decoded.id;
        next();
    });
};
