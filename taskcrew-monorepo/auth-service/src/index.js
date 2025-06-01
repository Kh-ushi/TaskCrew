require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require("./routes/auth");
const { verifyJWT } = require('./middleware/auth');

const app =express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// app.use((req, res, next) => {
//   console.log(`[auth-service] GOT ${req.method} ${req.originalUrl}`);
//   next();
// });

app.use('/auth',authRoutes);


(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    
    const port = process.env.PORT || 3002;
    app.listen(port, () => {
      console.log(`🚀 Auth Service running on port ${port}`);
    });
  } catch (err) {
    console.error('❌ Failed to start Auth Service:', err);
    process.exit(1);
  }
})();
