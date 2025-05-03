
const express=require("express");
const router=express.Router();

router.post("/addNew",(req,res)=>{
  
    console.log("ADD NEW HAS BEEN CALLED");
    console.log(req.body);

});


module.exports=router;