require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors  = require('cors');
const { verifyJWT } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const taskRoutes = require('./routes/tasks');

app.use('/tasks', verifyJWT, taskRoutes);


(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(process.env.PORT, () =>
    console.log(`Project Service ▶ http://localhost:${process.env.PORT}`)
  );
})();