import { getProjectSnapShot } from "./snapshotHelpers"

const accessControl=async(userId,projectId,token)=>{

    const snapshot=await getProjectSnapShot(projectId,token);
    if(!snapshot){
        return false;
    }

    return (
        String(snapshot.ownerId)==String(userId)||
        (Array.isArray(snapshot.members)&& snapshot.members.map(String).includes(String(userId)))
    )

};

const isUserTaskEditable=async(userId,task,token)=>{
    if(!task)return false;
     if (String(task.createdBy) === String(userId)) return true;
     if (Array.isArray(task.assignedTo) && task.assignedTo.map(String).includes(String(userId))) return true;

     return await accessControl(userId,task.projectId,token);
}

export{accessControl,isUserTaskEditable};