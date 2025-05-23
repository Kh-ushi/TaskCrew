require("dotenv").config();
const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Task = require("../models/Task");
const authenticate = require('../middleware/auth.middleware');
const axios = require("axios");
const mongoose = require("mongoose");

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

router.post("/addNew", authenticate, async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        console.log("📩 ADD NEW HAS BEEN CALLED");

        console.log(req.body);

        const { title, description, startDate, deadline, priority, teamMembers, image } = req.body;

        if (!title || !deadline || !teamMembers || teamMembers.length === 0) {
            return res.status(400).json({ error: "Title, deadline, and team members are required." });
        }

        const members = teamMembers.map(el => el.value);

        const newProject = new Project({
            title,
            description,
            image,
            createdBy: req.user.id,
            teamMembers: members,
            startDate,
            deadline,
            priority
        });

        const savedProject = await newProject.save({ session });

        const response = await axios.post(`${USER_SERVICE_URL}/auth/updateMembers`, { projectId: savedProject._id, members, manager: req.user.id });
        if (response.status != 201) {
            throw new Error('Failed to update members');
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({ message: "Project Added and Members updated" });

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        console.error("❌ Error creating project:", error);
        return res.status(500).json({ error: "Server error while creating project." });
    }
});


router.post("/getProjects", authenticate, async (req, res) => {
    try {
        const projectIds = req.body;
        const allProjects = await Project.find({
            _id: { $in: projectIds }
        });
        return res.status(201).json({ allProjects });
    }
    catch (error) {
        console.error("❌ Errors:", error);
        return res.status(500).json({ error: "Server error." });
    }

});


router.get("/getProjectDetail/:id", authenticate, async (req, res) => {
    try {

        const { id } = req.params;
        const details = await Project.findById(id).populate("tasks");
        if (!details) {
            throw new Error("Project ID not found");
        }
        return res.status(201).json({ details });

    }
    catch (error) {
        console.error("❌ Errors:", error);
        return res.status(500).json({ error: "Server error." });
    }

});


router.get("/getMemberIds/:id", authenticate, async (req, res) => {

    try {

        const { id } = req.params;
        const currentProject = await Project.findById(id);
        if (!currentProject) {
            res.status(500).json({ error: "Project not found" });
        }
        const members = currentProject.teamMembers;

        return res.status(201).json(members);

    }
    catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }

});

router.post('/addTask/:id', authenticate, async (req, res) => {

    try {
        const { id } = req.params;
        const { title, description, priority, startDate, dueDate, assignee } = req.body;
        const currentTask = await Task.findOne({ title });
        if (currentTask) {
            return res.status(500).json({ message: "Task with same title already exist" });
        }
        const currentProject = await Project.findById(id);
        const task = new Task({
            title,
            description,
            priority,
            startDate,
            dueDate,
            assignee:assignee.map((el)=>el.value),
            projectId: id
        });

        const newTask = await task.save();
        console.log(newTask);
        currentProject.tasks.push(newTask._id);
        await currentProject.save();

        return res.status(201).json({task:newTask});
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
