import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";



dotenv.config();

const { JWT_SECRET, AUTH_URL, PROJECT_URL, PORT } = process.env;

const app = express();

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(cors({ origin: true, credentials: true }));
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const verifyJWT = (req, res, next) => {
    console.log(req.originalUrl);
    console.log(AUTH_URL);

    if (req.path.startsWith("/auth")) {
        console.log("Hi I am inside jwt");
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access token missing" });
    }

    const accessToken = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(accessToken,JWT_SECRET);
        req.user = payload;     
        return next();

    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access token expired" });
        }
        return res.status(401).json({ message: "Invalid access token" });
    }
};


app.use("/api", verifyJWT);


app.use(
  "/api/auth",
  createProxyMiddleware({
    target:AUTH_URL,
    changeOrigin: true,
     pathRewrite: { "": "/auth" }, 
    cookieDomainRewrite: { "*": "" },
    logLevel: "debug",
  })
);


app.use(
    "/api/projects",
    createProxyMiddleware({
        target:PROJECT_URL,
        changeOrigin: true,
        pathRewrite: { "": "/projects" },
        cookieDomainRewrite: { "*": "" },
        logLevel: "debug",
    })
)



app.listen(PORT, () =>
    console.log(`API Gateway listening on http://localhost:${PORT}`)
);