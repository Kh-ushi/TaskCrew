
import bcrypt from 'bcrypt';
import User from '../models/User';
import { signToken } from '../utils/jwt';
import { sign } from 'jsonwebtoken';

const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(40).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user=new User({
            name,
            email,
            password: hashedPassword,
        });

        const token=signToken({id:user._id, email:user.email});
        res.staus(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token: token
        });
    }
    catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }

}


const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.find({email});
        if(!user || !(await bcrypt.compare(password, user.passwordHash))){
           return res.status(401).json({ msg: "Invalid credentials" });
        }
        const token=signToken({id:User._id,email:User.email});
        res.staus(201).json({
            message:"User Loffed in successfully",
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token: token
        });
    }
    catch(error){
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}