import jwt from "jsonwebtoken";
import {v4 as uuidv4} from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const generateToken=async(user)=>{
    const jti=uuidv4();
    const accessToken=jwt.sign({userId:user._id,email:user.email,jti},process.env.JWT_SECRET,{
        expiresIn:'7d'
    });

    return accessToken;
};

export {generateToken};