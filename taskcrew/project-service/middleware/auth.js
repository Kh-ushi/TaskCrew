import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const verifyToken = (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.stats(401).json({ message: "Missing Token" });

    try {
        const decoded = jwt.verify(token, dotenv);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Error in verifying token:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

};


export { verifyToken };