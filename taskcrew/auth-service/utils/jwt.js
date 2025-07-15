import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const signToken=(payload)=>{
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '2d'
  })
};

const verifyToken=(token)=>{
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error.message);
    throw new Error('Invalid token');
  }
};

export { signToken, verifyToken };