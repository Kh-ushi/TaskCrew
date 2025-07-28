import express from "express";
import cors from "cors";
// import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import axios from "axios";


dotenv.config();

const { JWT_SECRET, AUTH_URL,PORT} = process.env;

const app = express();

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
// app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const verifyJWT = async (req, res, next) => {

    if (req.path.startsWith("/api/auth")) return next();

    const auth = req.headers.authorization;
    if (!auth.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Access token missing" });
    }

    let accessToken = auth.split(" ")[1];
    try {

        const decoded = jwt.verify(accessToken, JWT_SECRET);
        req.user = decoded;
        return next();

    } catch (error) {
        if (error.name !== "TokenExpiredError") {
            return res.status(401).json({ message: "Invalid access token" });
        }
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token missing" });
        }
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token missing" });
        }
        try {
            const resp = await axios.post(`${AUTH_URL}/api/auth/refreshToken`, { refreshToken }, { withCredentials: true });
            const { accessToken: newAccess, refreshToken: newRefresh } = resp.data;
            res.cookie("refreshToken", newRefresh, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/"
            });
            accessToken = newAccess;
            req.headers.authorization = `Bearer ${newAccess}`;
            req.user = jwt.verify(newAccess, JWT_SECRET);
            return next();
        }
        catch {
            return res.status(401).json({ msg: "Invalid refresh token" });
        }
    }

};


app.use("/api", verifyJWT);


const makeProxy = (route, target) => {

    createProxyMiddleware(route, {
        target,
        changeOrigin: true,
        pathRewrite: { [`^/api${route}`]: "" },
        cookieDomainRewrite: "",
        logLevel: "warn"
    });
};

 app.use(makeProxy("/auth", AUTH_URL));

app.listen(PORT, () =>
  console.log(`API Gateway listening on http://localhost:${PORT}`)
);