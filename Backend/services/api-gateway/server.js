import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import authenticate from "./middleware/authenticate.js";

dotenv.config();

const {PORT,AUTH_URL,PROJECT_URL,NOTIF_URL}=process.env;

const app=express();

app.use(cors({origin:true,credentials:true}));

app.use("/api",authenticate);

//AUTH-URL-------------------------
app.use(
    "/api/auth",
    createProxyMiddleware({
        target:AUTH_URL,
        changeOrigin:true,
        pathRewrite:{"":"/auth"},
        cookieDomainRewrite:{"*": ""},
        logLevel: "debug"
    })
);

app.use(
    "/api/org",
    createProxyMiddleware({
        target:AUTH_URL,
        changeOrigin:true,
        pathRewrite:{"":"/org"},
        cookieDomainRewrite:{"*": ""},
        logLevel: "debug"
    })
)

app.use(
    "/api/space",
    createProxyMiddleware({
        target:AUTH_URL,
        changeOrigin:true,
        pathRewrite:{"":"/space"},
        cookieDomainRewrite:{"*": ""},
        logLevel: "debug"
    })
)

// ------------------Project Url---------------------

app.use(
    "/api/project",
    createProxyMiddleware({
        target:PROJECT_URL,
        changeOrigin:true,
        pathRewrite:{"":"/project"},
        cookieDomainRewrite:{"*":""},
        logLevel:"debug"
    })
)

app.use(
    "/api/task",
    createProxyMiddleware({
        target:PROJECT_URL,
        changeOrigin:true,
        pathRewrite:{"":"/task"},
        cookieDomainRewrite:{"*":""},
        logLevel:"debug"
    })
)

// -----------------------------------------

app.use(
    "/api/notifications",
    createProxyMiddleware({
        target:NOTIF_URL,
        changeOrigin:true,
        pathRewrite:{"":"/notifications"},
        cookieDomainRewrite:{"*":""},
        logLevel:"debug"
    })
)

app.listen(PORT,()=>{
     console.log(`Server is running on port ${PORT}`);
});