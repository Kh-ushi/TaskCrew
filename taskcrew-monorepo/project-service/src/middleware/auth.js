const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(403).json({ message: err.name === 'TokenExpiredError'
      ? 'Token expired' : 'Invalid token' });
  }
}

module.exports = { verifyJWT };
