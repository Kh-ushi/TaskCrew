require('dotenv').config();

const express=require("express");
const mongoose=require("mongoose");
const cors = require("cors");
const connectDB=require("./src/config/db");

const projectRoutes=require("./src/controllers/proj.controller");

const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/project",projectRoutes);

connectDB()
.then(()=>{
  const PORT = process.env.PORT || 3002;
  app.listen(PORT,()=>console.log(`✅Project Service Running on Port ${PORT}`))
})
.catch((error) => {
    console.error("❌ Database Connection Failed:", error);
    process.exit(1);
});