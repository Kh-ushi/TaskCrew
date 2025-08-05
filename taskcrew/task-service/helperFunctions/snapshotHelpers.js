import axios from "axios";
import ProjectSnapshot from "../models/ProjectSnapshot.js";
import dotenv from "dotenv";

dotenv.config();

const bootStrapSnapshot = async (projectId, token) => {

    try {
        console.log("bootstrapSnapshot");
        console.log(token);
        console.log(projectId);
        const resp = await axios.get(`${process.env.PROJECT_URL}/projects/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const { ownerId, members, startDate, endDate } = resp.data;
        await ProjectSnapshot.updateOne(
           {_id:projectId},
           {
            _id:projectId,
            ownerId,
            members:members||[],
            startDate:new Date(startDate),
            endDate:endDate?new Date(endDate):null,
             updatedAt: new Date(),
           } ,
           {upsert:true}
        );

        return await ProjectSnapshot.findById(projectId).lean();
    }
    catch (error) {
        console.warn("bootstrapSnapshot failed:", error.message);
        return null;
    }

};


const getProjectSnapShot=async(projectId,token)=>{

    let snapshot=await ProjectSnapshot.findById(projectId).lean();
    if(!snapshot){
        snapshot = await bootStrapSnapshot(projectId,token);
    }

    return snapshot;

}

export {getProjectSnapShot};