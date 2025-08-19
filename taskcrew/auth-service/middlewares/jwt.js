import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import redisClient from '../redis/redisClient.js';

dotenv.config();


const verifyToken = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isBlacklisted = await redisClient.get(`blacklist:${decoded.jti}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token is blacklisted" });
    }

    req.user = {
      userId: decoded.userId,
      jti: decoded.jti,
    };

    next();
    
  } catch (error) {
    console.log("I am in auth-middleware-verify token");
    console.log(error.name);
    console.error("Token verification failed:", error.message);

    if(error.name=== "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

export { verifyToken };