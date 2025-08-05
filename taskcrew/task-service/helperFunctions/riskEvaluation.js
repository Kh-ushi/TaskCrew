import { getProjectSnapShot } from "./snapshotHelpers.js";
import Task from "../models/Task.js";
import redisClient from "../redis/redisClient.js";
import crypto from "crypto";


const evaluateProjectRisk = async (projectId, token) => {

    const project = await getProjectSnapShot(projectId, token);
    if (!project) return null;

    const now = new Date();

    if (!project.startDate || !project.endDate) return null;
    const totalWindowMs = new Date(project.endDate) - new Date(project.startDate);
    if (totalWindowMs <= 0) return null;

    const elapsedFraction = Math.min(1, Math.max(0, (now - new Date(space.startDate)) / totalWindowMs));

    const rootTasks = await Task.find({ projectId: projectId, subtasks: { $exists: true } }).lean();

    if (rootTasks.length == 0) return null;

    const aggregateProgress = rootTasks.reduce((sum, t) => {
        const p = (t.subtaskProgress && typeof t.subtaskProgress === "number") ? t.subtaskProgress.percent : (t.status === "done" ? 100 : 0);
        return sum + p;
    }, 0) / rootTasks.length;

    const safetyMargin = 15;
    const behind = aggregateProgress + safetyMargin < elapsedFraction * 100;

    return {
        projectId,
        ownerId: space.ownerId,
        currentProgress: Math.round(aggregateProgress),
        timeElapsedPercent: Math.round(elapsedFraction * 100),
        deadline: space.endDate,
        behind,
        timeStamp: Date.now()
    }
};


const runRiskCheckAndNotify = async (projectId, token) => {

    const risk = await evaluateProjectRisk(projectId, token);
    if (!risk) return;

    if (risk.behind) {

        await redisClient.publish("project:riskDetected", JSON.stringify({
            projectId: risk.projectId,
            ownerId: risk, ownerId,
            currentProgress: risk.currentProgress,
            timeElapsedPercent: risk.timeElapsedPercent,
            deadline: risk.deadline,
            alertLevel: "warning",
            correlationId: crypto.randomUUID(),
            timestamp: risk.timestamp,
        }));
    }
}

export{runRiskCheckAndNotify};