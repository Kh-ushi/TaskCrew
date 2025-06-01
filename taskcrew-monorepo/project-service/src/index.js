require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors  = require('cors');


const { verifyJWT } = require('./middleware/auth');
const projectRoutes = require('./routes/projects');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/projects', verifyJWT, projectRoutes);

// app.get('/health', (req, res) =>
//   res.json({ status: 'OK', service: 'project' })
// );

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(process.env.PORT, () =>
    console.log(`Project Service ▶ http://localhost:${process.env.PORT}`)
  );
})();
