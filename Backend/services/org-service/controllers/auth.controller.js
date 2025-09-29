import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
   try {
      const { name, email, password } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
         return res.status(400).json({ message: "Email already in use" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
         name,
         email,
         password: hashedPassword
      });

      const accessToken = await generateToken(newUser);
      return res.status(201).json({
         message: "User registered successfully",
         user: newUser,
         accessToken
      });
   }
   catch (error) {
      console.error("Registration error:", error.message);
      res.status(500).json({ message: "Internal server error" });
   }
};

const login = async (req, res) => {

   try {

      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !await bcrypt.compare(password, user.password)) {
         return res.status(401).json({ message: "Invalid Credentials" });
      }

      const accessToken = await generateToken(user);

      return res.status(201).json({
         message: "User logged in successfully",
         user,
         accessToken
      });

   }
   catch (error) {
      console.error("Login error:", error.message);
      res.status(500).json({ message: "Internal server error" });
   }

}


const verifyToken = async(req, res)=>{

   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Token missing" });
   }

   const accessToken = authHeader.split(" ")[1];
   try {
      const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
      const {userId}=payload;
      const user=await User.findById(userId);
      res.status(200).json({success:true,user});
   } catch (error) {
      if (error.name === "TokenExpiredError") {
         return res.status(401).json({ success: false, message: "Access token expired" });
      }
      return res.status(401).json({ success: false, message: "Invalid access token" });
   }
}

export { register, login ,verifyToken};