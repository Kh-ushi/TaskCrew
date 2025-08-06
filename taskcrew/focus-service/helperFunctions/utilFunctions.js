import UserProjectFocus from "../models/UserProjectFocus.js";
import ProjectSnapshot from "../models/ProjectSnapshot.js";
import TaskSnapshot from "../models/TaskSnapshot.js";
import dotenv from 'dotenv';
dotenv.config();

const behindSchedule = (startDate, endDate) => {
    const now = Date.now();
    if (!startDate || !endDate) return false;
    const span = endDate.getTime() - startDate.getTime();
    return span > 0 && (now - startDate.getTime) / span > 1;
};

const trackView = async (userId, projectId) => {

    await UserProjectFocus.findOneAndUpdate({ userId, projectId },
        { $set: { lastViewedAt: Date.now() } }, {
        upsert: true
    });

};

const setPinned = async (userId, projectId, pinned) => {
    await UserProjectFocus.findOneAndUpdate({ userId, projectId }, {
        $set: { pinned }
    }, {
        upsert: true
    });

}


const computeScoreForProject = async (userId, projectId) => {

    const project = await ProjectSnapshot.findOne({ projectId });
    if (!project) { return null; }

    let dp = 0;
    if (project.startDate && project.endDate) {
        const now = Date.now();
        const total = project.endDate.getTime() - project.startDate.getTime();
        dp = total > 0
            ? Math.min(100, Math.max(0, ((now - project.startDate.getTime()) / total) * 100))
            : 0;
    }

    const bs = behindSchedule(project.startDate, project.endDate) ? 100 : 0;

    const tasks = await TaskSnapshot.find({
        projectId,
        assignedTo: userId,
        status: {
            $ne: "done"
        }
    });

    const highPrioCount = tasks.filter(t => t.priority === 'High').length;

    const recentCount = tasks.filter(t => {
        const diffMs = Date.now() - t.updatedAt.getTime();
        return diffMs < 1000 * 60 * 60 * 24;
    }).length;


    const score = Math.round(
        dp * 0.3 +
        bs * 0.3 +
        (highPrioCount > 0 ? 100 : 0) * 0.2 +
        (recentCount > 0 ? 100 : 0) * 0.2
    );


    return { projectId, score, behind: bs === 100, highPrioCount, recentCount };
};

const computePrioritiesForUser = async (userId) => {

    const records = await UserProjectFocus.find({ userId });
    const updates = [];
   
    for (const record of records) {
        const data= await computeScoreForProject(userId, record.projectId);
        if(!data){continue;}
        record.priorityScore=data.score;
        updates.push(data);
        await record.save();
    }

    const highCount=updates.filter(u=>u.score>=process.env.URGENT_THRESHOLD).length;
    const overloaded=highCount>=process.env.OVERLOAD_LIMIT;

    await UserProjectFocus.updateMany(
        {userId},
        {isOverloaded:overloaded}
      );

      return { userId, isOverloaded: overloaded, highUrgencyCount: highCount, projects: updates };
};


const analyzeUserLoad=async(userId)=>{

    const projects=await ProjectSnapshot.findOne({
        $or:[
            {ownerId:userId},
            {members:userId}
        ]
    });

    const details=[];

    for(const project of projects){
        const data=await computeScoreForProject(userId,project._id);
        if(!data){continue;}
        details.push(data);
    }

    const highCount=details.filter(d=>d.score>=process.env.URGENT_THRESHOLD).length;
    const overloaded=highCount>=process.env.OVERLOAD_LIMIT;

    return {
        userId,
        isOverloaded: overloaded,
        highUrgencyCount: highCount,
        projects: details
      };

}

export { trackView,setPinned,computePrioritiesForUser,analyzeUserLoad };



