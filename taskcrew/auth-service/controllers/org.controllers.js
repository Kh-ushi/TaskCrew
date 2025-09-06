
import bcrypt from "bcrypt";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import { generateTokens } from "../utils/generateToken.js";
import redisClient from "../redis/redisClient.js";
import { emitEvent } from "../helperFunctions/events.js";


const addOrganization = async (req, res) => {
    try {
        const { orgName, domain, ownerName, ownerEmail, password, phoneNumber } = req.body;
        console.log(req.body);
        if (!orgName || !ownerName || !ownerEmail || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        //create new user 
        const existing = await User.findOne({ email: ownerEmail });
        if (existing) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name: ownerName,
            email: ownerEmail,
            password: hashedPassword,
        });

        const newUser = await user.save();

        const { accessToken, refreshToken } = await generateTokens(newUser._id, newUser.email);
        await redisClient.set(`refresh:${newUser._id}`, refreshToken, {
            EX: 7 * 24 * 60 * 60,
        });

        //create new organization
        const existingOrg = await Organization.findOne({ name: orgName });
        if (existingOrg) {
            return res.status(400).json({ message: "Organization name already exists" });
        }
        const organization = await Organization.create({ name: orgName, domain: domain, owner: newUser._id });
        await organization.populate("owner");

        newUser.organizationId = organization._id;
        await newUser.save();

        return res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(201).json({
            message: "Organization added successfully",
            organization,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            accessToken,
        });
    } catch (error) {
        console.log(error);
        console.error(error);
        return res.status(500).json({ error: "Failed to add organization" });
    }
};

const addNewOrganization = async (req, res) => {
    try {
        const { userId } = req.user;
        console.log(userId);
        const user = await User.findById(userId);
        console.log("I am in addNewOrganization");
        console.log(user);
        const { orgName, domain } = req.body;
        console.log(req.body);
        if (!orgName) {
            console.log("Organization name is required");
            return res.status(400).json({ error: "Organization name is required" });
        }
        const existingOrg = await Organization.findOne({ name: orgName });
        if (existingOrg) {
            console.log("Organization name already exists");
            return res.status(400).json({ message: "Organization name already exists" });
        }
        const organization = await Organization.create({ name: orgName, domain: domain, owner: user._id });
        await organization.populate("owner");
        user.organizationId = organization._id;
        await user.save();
        return res.status(201).json({ message: "Organization added successfully", organization });
    } catch (error) {
        console.log(error);
        console.error(error);
        return res.status(500).json({ error: "Failed to add organization" });
    }
};

const getOrganizations = async (req, res) => {
    try {
        console.log("I am in getOrganizations");
        const { userId } = req.user;
        const orgs = await Organization.find({ $or: [{ owner: userId }, { members: { $elemMatch: { userId } } }] }).populate("owner").populate("members.userId", "name email");
        console.log(orgs);
        return res.status(200).json({ organizations: orgs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get organizations" });
    }
};

const deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const organization = await Organization.findByIdAndDelete(id);
        if (!organization) {
            return res.status(404).json({ error: "Organization not found" });
        }
        res.status(200).json({ message: "Organization deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete organization" });
    }
};


const inviteMembers = async (req, res) => {
    try {
        console.log("I am in inviteMembers");
        console.log(req.body);

        const { emails, role, message = "" } = req.body;
        const { id } = req.params;
        const { userId } = req.user;
        const existingUsers = await User.find({ email: { $in: emails }, _id: { $ne: userId } });
        const existingEmails = existingUsers.map(u => u.email);
        console.log(existingEmails);
        const orgName = await Organization.findById(id)


        await Promise.all(existingEmails.map(email => emitEvent("org:invite", { organizationId: id, data:{email,role,message,orgName:orgName.name} })));

        const missingEmails = emails.filter(e => !existingEmails.includes(e));
        return res.status(200).json({
            message: "Invitation processed",
            sent: existingEmails,
            notFound: missingEmails
        });
    } catch (error) {
        console.error("inviteMembers error:", error.message, error.stack);
        return res.status(500).json({ error: "Failed to invite members" });
    }
}


export { addOrganization, addNewOrganization, getOrganizations, deleteOrganization, inviteMembers };