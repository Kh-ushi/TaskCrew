import express from "express";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import ProjectSnapshot from "../models/ProjectSnapshot.js";
import redisClient from "../redis/redisClient.js";
import crypto from "crypto";
import { accessControl, isUserTaskEditable } from "../helperFunctions/accessControlHelpers.js";
import { getProjectSnapShot } from "../helperFunctions/snapshotHelpers.js";
import { runRiskCheckAndNotify } from "../helperFunctions/riskEvaluation.js";
import { Console } from "console";


dayjs.extend(relativeTime);
const router = express.Router({ mergeParams: true });

const createTask = async (req, res) => {

    try {

        console.log("createTask");
        // const authHeader = req.headers.authorization;
        // if (!authHeader || !authHeader.startsWith("Bearer ")) {
        //     return res.status(401).json({ msg: "No token provided in createTask" });
        // }

        // const token = authHeader.split(" ")[1];

        // const userId = req.user.userId;
        // const {
        //     title,
        //     description = "",
        //     projectId,
        //     assignedTo = [],
        //     priority = "Medium",
        //     startTime,
        //     endTime,
        //     status = "todo",
        // } = req.body;

        // if (!title || !projectId || !startTime || !endTime) {
        //     return res.status(400).json({ message: "title, projectId, startTime and endTime are required" });
        // }

        // if (!(await accessControl(projectId, userId, token))) {
        //     return res.status(403).json({ message: "Forbidden: cannot access project" });
        // }

        // const project = await getProjectSnapShot(projectId, token);
        // if (!project) return res.status(404).json({ message: "Project not found" });


        // const st = new Date(startTime);
        // const et = new Date(endTime);

        // if (st < new Date(project.startDate) || et > new Date(project.endDate)) {
        //     return res.status(400).json({ message: "Task must be within project start and deadline" });
        // }


        // const task = await Task.create({
        //     title,
        //     description,
        //     projectId,
        //     assignedTo,
        //     createdBy: userId,
        //     status,
        //     priority,
        //     startTime: st,
        //     endTime: et,
        // });

        // runRiskCheckAndNotify(projectId, token);

        // await redisClient.publish("task:created", JSON.stringify({
        //     taskId: task._id,
        //     projectId: task.projectId,
        //     assignees: task.assignedTo,
        //     startTime: task.startTime,
        //     endTime: task.endTime,
        //     parentTaskId: task.parentTaskId,
        //     status: task.status,
        //     priority: task.priority,
        //     correlationId: crypto.randomUUID(),
        //     timestamp: Date.now(),
        // }));

        // res.status(201).json(task);

    }
    catch (error) {
        console.error("createTask failed:", error);
        res.status(500).json({ message: "Internal server error", details: error.message });
    }

};


const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.status(201).json(task);

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch task", error: error.message });
    }

};


const getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await Task.find({ projectId }).sort({ dueDate: 1, updatedAt: -1 });
        res.status(201).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
    }
};

const getMyTasks = async (req, res) => {

    try {
        const userId = req.user.userId;
        const tasks = await Task.find({ $or: [{ createdBy: userId }, { assignedTo: userId }] }).sort({ dueDate: 1 });
        res.status(201).json(tasks);
    }
    catch (error) {
        console.error("Failed to fetch your tasks", error.message);
        res.status(500).json({ message: "Failed to fetch your tasks", error: error.message });
    }

};


const updateTask = async (req, res) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "No token provided in createTask" });
        }

        const token = authHeader.split(" ")[1];

        const userId = req.user.userId;
        const { taskId } = req.params;

        const updates = req.body;

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (!(await isUserTaskEditable(userId, task, token))) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (updates.startTime || updates.endTime) {
            const project = await getProjectSnapShot(project, token);
            if (!project) return res.status(404).json({ message: "Project not found" });

            const newStart = updates.startTime ? new Date(updates.startTime) : task.startTime;
            const newEnd = updates.endTime ? new Date(updates.endTime) : task.endTime;

            if (newStart < new Date(project.startDate) || newEnd > new Date(project.endDate)) {
                return res.status(400).json({ message: "Task must remain within project boundaries" });
            }

            task.startTime = newStart;
            task.endTime = newEnd;
        }


        if (typeof updates.title === "string") task.title = updates.title;
        if (typeof updates.description === "string") task.description = updates.description;
        if (typeof updates.status === "string") task.status = updates.status;
        if (typeof updates.priority === "string") task.priority = updates.priority;
        if (Array.isArray(updates.assignedTo)) task.assignedTo = updates.assignedTo;
        if (updates.subtasks) task.subtasks = updates.subtasks;

        task.recomputeSubtaskProgress();

        await task.save();

        runRiskCheckAndNotify(task.projectId, token);

        await redisClient.publish("task:updated", JSON.stringify({
            taskId: task._id,
            projectId: task.projectId,
            updatedFields: Object.keys(updates),
            status: task.status,
            subtaskProgress: task.subtaskProgress,
            correlationId: crypto.randomUUID(),
            timestamp: Date.now(),
        }));
    }
    catch (error) {
        console.error("updateTask failed:", error);
        res.status(500).json({ message: "Internal server error", details: error.message });
    }


};

const deleteTask = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "No token provided in createTask" });
        }

        const token = authHeader.split(" ")[1];

        const userId = req.user.userId;
        const { taskId } = req.params;

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (!(await isUserTaskEditable(userId, task, token))) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await Task.deleteOne({ _id: taskId });

        runRiskCheckAndNotify(task.projectId, token);

        await redisClient.publish("task:deleted", JSON.stringify({
            taskId,
            projectId: task.projectId,
            correlationId: crypto.randomUUID(),
            timestamp: Date.now(),
        }));

        res.status(201).json({message: "Deleted",task});


    }
    catch (error) {
        console.error("Task Deletion failed:", error);
        res.status(500).json({ message: "Internal server error", details: error.message });
    }
}




export { createTask, getTaskById, getMyTasks, getTasksByProject, updateTask,deleteTask};






