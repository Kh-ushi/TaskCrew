const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();


router.post('/',async(req,res)=>{
   console.log(req.body);
});

module.exports=router;