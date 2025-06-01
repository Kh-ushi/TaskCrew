const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing.' });
        }

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = payload;
        next();

    }
    catch (err) {
        console.error('JWT verification failed:', err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired.' });
        }
        res.status(403).json({ message: 'Invalid token.' });
    }
}

module.exports = { verifyJWT };
