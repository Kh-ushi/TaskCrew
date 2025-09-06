import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import redisClient from '../redis/redisClient.js';
import dotenv from 'dotenv';
dotenv.config();

const generateTokens=async(userId,email)=>{

    const jti=uuidv4();

    // const accessToken=jwt.sign({userId,email,jti},process.env.JWT_SECRET,{
    //     expiresIn:'15s'
    // });

     const accessToken=jwt.sign({userId,email,jti},process.env.JWT_SECRET);


    // const refreshToken=jwt.sign({userId,email,jti},process.env.JWT_REFRESH_SECRET,{
    //     expiresIn:'7d'
    // });

    const refreshToken=jwt.sign({userId,email,jti},process.env.JWT_REFRESH_SECRET);

    await redisClient.set(`refresh:${userId}`,refreshToken,{EX:7*24*60*60});

    return {accessToken,refreshToken};

};


export{generateTokens};