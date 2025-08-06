import {trackView,setPinned,computePrioritiesForUser, analyzeUserLoad } from "../helperFunctions/utilFunctions";
import dotenv from 'dotenv';
dotenv.config();

const viewProject=async(req,res)=>{
  try{
    const {userId}=req.user;
    const {projectId}=req.params;
    if(!userId || !projectId){
        return res.status(400).json({message:"User ID and Project ID are required"});
    }
    await trackView(userId,projectId);
    const result=await computePrioritiesForUser(userId);
    res.status(201).json({message:"Project viewed successfully",dashboard:result});
  }
  catch(error){
    console.error("Error viewing project:",error);
    res.status(500).json({message:"Internal server error"});
  }
};

const pinProject=async(req,res)=>{
    try{
        const {userId}=req.user;
        const {projectId}=req.params;
        const {pin}=req.body;
        if(!userId || !projectId){
            return res.status(400).json({message:"User ID and Project ID are required"});
        }
        await setPinned(userId,projectId,pin);
        const result=await computePrioritiesForUser(userId);
        res.status(201).json({message:pin ? "Project pinned successfully" : "Project unpinned successfully",dashboard:result});
    }
    catch(error){
        console.error("Error pinning project:",error);
        res.status(500).json({message:"Internal server error"});
    }
};

const  getDashboard=async(req,res)=>{
    try{
        const {userId}=req.user;
        const result = await computePrioritiesForUser(req.params.userId);
        res.status(201).json({message:"Dashboard fetched successfully",dashboard:result});
    }
    catch(error){
        console.error("Error fetching dashboard:",error);
        res.status(500).json({message:"Internal server error"});
    }
};


const getOverload=async(req,res)=>{
    try{
        const {userId}=req.user;
        const result = await analyzeUserLoad(userId);
        res.status(201).json({message:"Overload fetched successfully",overload:result});
    }
    catch(error){
        console.error("Error fetching overload:",error);
        res.status(500).json({message:"Internal server error"});
    }
};


export {viewProject,pinProject,getDashboard,getOverload};