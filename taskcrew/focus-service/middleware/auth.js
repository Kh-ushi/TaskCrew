import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import redisClient from "../redis/redisClient.js";

dotenv.config();


const verifyToken = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isBlacklisted = await redisClient.get(`blacklist:${decoded.jti}`);
    if (isBlacklisted) {
      return res.status(401).json({ msg: "Token is blacklisted" });
    }
    req.user = {
      userId: decoded.userId,
      jti: decoded.jti,
    };

    next();

  } catch (error) {
    console.error("Token verification failed:", error.message);
    throw new Error('Invalid or expired token');
  }
};


export { verifyToken };