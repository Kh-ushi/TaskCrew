require('dotenv').config();

const express = require("express");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {

    if (req.path.startsWith('/api/auth')) return next();

    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid auth header' });
    }

    const token = auth.split(' ')[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch (err) {
        return res.status(403).json({
            message: err.name === 'TokenExpiredError'
                ? 'Token expired' : 'Invalid token'
        });
    }
});



// app.use('/api/auth', (req, res, next) => {
//   console.log(`→ [gateway] incoming ${req.method} ${req.originalUrl}`);
//   next();
// });

// app.use('/api/auth', (req, res, next) => {
//   console.log(`→ [GATEWAY AUTH MATCH] ${req.method} ${req.originalUrl}`);
//   next();
// });

// app.use( '/api/projects', (req,res,next)=>{
//     console.log(`→ [GATEWAY PROJECTS MATCH] ${req.method} ${req.originalUrl}`);
//     console.log(req.body);
//     next();
//   },)


app.use(
  '/api/auth',
  createProxyMiddleware({
    target: process.env.AUTH_URL,
    changeOrigin: true,
    pathRewrite: { '^': '/auth' },
  })
);


app.use(
  '/api/projects',
  createProxyMiddleware({
    target: process.env.PROJECTS_URL,
    changeOrigin: true,
    pathRewrite: { '^': '/projects' },
  })
);

app.use(
  '/api/tasks',
  createProxyMiddleware({
    target: process.env.TASKS_URL,
    changeOrigin: true,
    pathRewrite: { '^': '/tasks' },
  })
);






(async () => {
    try {
        const port = process.env.PORT || 3001;
        app.listen(port, () =>
            console.log(`🚀 API Gateway running on http://localhost:${port}`)
        );
    }
   catch (err) {
    console.log(err);
    console.error('Gateway failed to start:', err);
    process.exit(1);
  }
})();