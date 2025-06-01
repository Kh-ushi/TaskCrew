const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { verifyJWT } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name,Email and Password are required' });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash: hash });

    if (!user) {
      return res.status(401).json({ message: 'Some Error Ocuured.Try Again' })
    }

    // console.log(user);

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // console.log(token);

    res.status(201).json({ token, id: user._id, email: user.email, name});

  } catch (err) {
    console.log(err);
    console.error('Error [POST /api/auth/register]:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    console.log(token);

    res.status(201).json({ token });

  } catch (err) {
    // console.log(err);
    console.error('Error [POST /api/auth/login]:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


router.get('/allUsers',verifyJWT,async(req,res)=>{
   try{
     const allUsers=await User.find({_id: { $ne: req.user.id } });
     res.status(200).json(allUsers);
   }
   catch(err){
      console.error('Error [GET /api/auth/allUsers]:', err);
      res.status(500).json({ message: 'Internal server error.' });
   }
    
});


module.exports = router;