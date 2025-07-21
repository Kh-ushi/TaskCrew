
import bcrypt from 'bcrypt';
import User from '../models/User';
import { generateTokens } from '../utils/generateToken';
import redisClient from '../redis/redisClient';
import jwt from 'jsonwebtoken';


const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(40).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        const { accessToken, refreshToken } = await generateTokens(user._id);

        return res.status(201).json({

            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken,
            refreshToken

        });
    }
    catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }

}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.find({ email });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = await generateTokens(user._id);

        return res.status(201).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken,
            refreshToken
        });
    }
    catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


const logout = async (req, res) => {

    try {

        const authHeader = req.headers.authorization;
        const refreshToken = req.body.refreshToken;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "Access token missing" });
        }

        if (!refreshToken) {
            return res.status(400).json({ msg: "Refresh token required in body" });
        }

        const accessToken = authHeader.split(" ")[1];
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        const jti = decoded.jti;
        const userId = decoded.userId;

        await redisClient.set(`blacklist:${jti}`, true, {
            EX: 15 * 60
        });

        await redisClient.del(`refresh:${userId}`);

        return res.status(200).json({ msg: "User logged out successfully" });

    }
    catch (error) {
        console.error("Logout failed:", err.message);
        return res.status(500).json({ message: "Logout failed" });
    }

};


const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token required" })
        }
        let decoded;

        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            return res.status(403).json({ msg: "Invalid or expired refresh token" });
        }

        const userId = decoded.userId;

        const storedToken = await redisClient.get(`refresh:${userId}`);
        if (storedToken !== refreshToken) {
            return res.status(403).json({ msg: "Refresh token no longer valid (rotated or reused)" });
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateTokens(userId);

        await redisClient.set(`refresh:${userId}`, newRefreshToken, {
            EX: 7 * 24 * 60 * 60,
        });

        return res.status(201).json({
            accessToken,
            refreshToken: newRefreshToken,
        });
    }
    catch (error) {
        console.error("Refresh token error:", error.message);
        res.status(500).json({ msg: "Failed to refresh token" });

    }

};


export { register, login, logout,refreshToken};