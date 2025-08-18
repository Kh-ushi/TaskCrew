
import bcrypt from "bcrypt";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import { generateTokens } from "../utils/generateToken.js";
import redisClient from "../redis/redisClient.js";


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

        const { accessToken, refreshToken } = await generateTokens(newUser._id);
        await redisClient.set(`refresh:${newUser._id}`, refreshToken, {
            EX: 7 * 24 * 60 * 60,
        });

        //create new organization
        const organization = new Organization({ name: orgName, domain: domain, owner: newUser._id });
        await organization.save();

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

const getOrganizations = async (req, res) => {
    try {
        console.log("I am in getOrganizations");
        const {userId}=req.user;
        const user=await User.findById(userId).populate("organizationId");
        if(user.organizationId!=null || user.organizationId!=undefined || user.organizationId!=""){
           return res.status(200).json({organization:user.organizationId}); 
        }
        return res.status(200).json({organization:null}); 
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


export { addOrganization,getOrganizations, deleteOrganization };