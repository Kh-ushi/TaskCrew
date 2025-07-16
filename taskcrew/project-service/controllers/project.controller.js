import Project from "../models/Project";
import {redisClient} from "../redis/redisClient";

const createProject=async(req,res)=>{
    try{

        const {name,description,ownerId,members,startDate,endDate}=req.body;
        if(!name || !ownerId || !startDate){
            return res.status(400).json({message:"Name, OwnerId and StartDate are required"});
        }

        const project=await Project.create({
            name,
            description,
            ownerId,
            members,
            startDate,
            endDate:endDate?endDate:null,  
        });

        await redisClient.publish("project:created",JSON.stringify({
            projectId:project._id,
            name:project.name,
            ownerId:project.ownerId,
            startDate:project.startDate,
            endDate:project.endDate,
        }));

    }
    catch(error){
        console.error("Error creating project:", error);
        return res.status(500).json({message:"Internal Server Error"});
    }

};


export{createProject};