import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import redisClient from '../redis/redisClient';
import dotenv from 'dotenv';
dotenv.config();

const generateTokens=async(userId)=>{

    const jti=uuidv4();

    const accessToken=jwt.sign({userId,jti},process.env.JWT_SECRET,{
        expiresIn:'15m'
    });

    const refreshToken=jwt.sign({userId,jti},process.env.JWT_REFRESH_SECRET,{
        expiresIn:'7d'
    });

    await redisClient.set(`refresh:${userId}`,refreshToken,{EX:7*24*60*60});

    return {accessToken,refreshToken};

};


export{generateTokens};