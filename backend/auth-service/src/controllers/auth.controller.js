const express = require("express");
const { generateToken, generateTeamCode } = require("../../helperFunction");
const authenticate = require("../middleware/auth.middleware");

const User = require("../models/User");
const Team = require("../models/Team");


const router = express.Router();

router.post("/signUp", async (req, res) => {

    try {
        const { fullName, email, password, confirmPassword } = req.body;

        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(500).json({ error: "All fields are required" });
        }

        if (password != confirmPassword) {
            return res.status(500).json({ error: "Passwords do not match" });
        }

        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(500).json({ error: "User already exists" });
        }

        const newUser = new User({ name: fullName, email, password });
        await newUser.save();

        const token = generateToken(newUser);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },
            token
        });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }

});


router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(500).json({ error: "Invalid Credentials" });
        }

        const token = generateToken(user);

        res.status(201).json({
            message: "User has loggedIn Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });

    }
    catch (error) {
        console.log(error);
        console.error("Login Error", error);
        res.status(500).json({ error: "Login Failed" });
    }

});


router.get("/getUsers", authenticate, async (req, res) => {
    try {
        console.log("I am being called");
        // console.log(req.user);
        const allUsers = await User.find({ _id: { $ne: req.user.id } });
        // console.log(allUsers);
        res.status(201).json({
            data: allUsers
        })
    } catch (error) {
        console.log(error);
        console.error("Login Error", error);
        res.status(500).json({ error: "Login Failed" });
    }

});


router.post("/updateMembers", async (req, res) => {
    const { projectId, members, manager } = req.body;

    try {
        const projectManager= await User.findById(manager);
        if (!projectManager) {
            return res.status(404).json({ error: `User with ID ${projectManager} not found.` });
        }
        projectManager.joinedProjects.push(projectId);
        await projectManager.save();

        for (let emp of members) {
            const member = await User.findById(emp);
            if (!member) {
                return res.status(404).json({ error: `User with ID ${emp} not found.` });
            }
            member.joinedProjects.push(projectId);
            await member.save();
        }

        res.status(201).json({ message: "Members updated successfully." });

    } catch (error) {
        console.error("Error updating members:", error);
        res.status(500).json({ error: "An error occurred while updating members." });
    }

});



module.exports = router;