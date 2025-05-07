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

        res.status(201).json({ message: "Project Added and Members updated" });

    } catch (error) {

        await session.abortTransaction();
        session.endSession();

        console.error("❌ Error creating project:", error);
        res.status(500).json({ error: "Server error while creating project." });
    }
});


router.post("/getProjects", authenticate, async (req, res) => {
    try {
        const projectIds = req.body;
        const allProjects = await Project.find({
            _id: { $in: projectIds }
        });
        res.status(201).json({ allProjects });
    }
    catch (error) {
        console.error("❌ Errors:", error);
        res.status(500).json({ error: "Server error." });
    }

});


router.get("/getProjectDetail/:id", authenticate, async (req, res) => {
    try {

        const { id } = req.params;
        const details = await Project.findById(id);
        if (!details) {
            throw new Error("Project ID not found");
        }
        res.status(201).json({ details });

    }
    catch (error) {
        console.error("❌ Errors:", error);
        res.status(500).json({ error: "Server error." });
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

        res.status(201).json(members);

    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }

});

router.post('/addTask/:id', authenticate, async (req, res) => {

    try {
        const { id } = req.params;
        const { title, description, priority, startDate, dueDate, assignee } = req.body;
        const currentTask = await Task.findOne({ title });
        if (currentTask) {
            res.status(500).json({ message: "Task with same title already exist" });
        }
        const currentProject = await Project.findById(id);
        const task = new Task({
            title,
            description,
            priority,
            startDate,
            dueDate,
            assignee,
            projectId: id
        });

        const newTask = await task.save();
        currentProject.tasks.push(newTask._id);
        await currentProject.save();

        res.status(201).json({ message: "Task Has Been Added Succesfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
