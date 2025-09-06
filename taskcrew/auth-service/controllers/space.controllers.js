import Space from "../models/Space.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js";
import { emitEvent } from "../helperFunctions/events.js";

const createSpace = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const { name, description, icon, color = "", visibility, members = [], settings = {} } = req.body;

        console.log(req.body);
        console.log(id);

        const space = new Space({
            name,
            description,
            icon,
            color,
            visibility,
            members,
            settings,
            orgId: id,
            ownerId: userId,
            createdBy: userId,
            updatedBy: userId
        });

        space.ensureOwnerMember();
        await space.save();

        const organization = await Organization.findById(id);
        organization.spaces.push(space._id);
        await organization.save();

        return res.status(201).json({ space });
    } catch (err) {
        if (err.code === 11000) {
            // duplicate key for (orgId,name) or (orgId,slug)
            return res.status(409).json({ error: "Space with same name already exists in this organization." });
        }
        console.error("createSpace error:", err);
        return res.status(500).json({ error: "Failed to create space" });
    }

}

const getSpaces = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;
        const spaces = await Space.find({ $or: [{ ownerId: userId }, { "members.userId": userId }], orgId: id });
        console.log(spaces);
        return res.status(200).json({ spaces });
    } catch (error) {
        console.error("getSpaces error:", error);
        return res.status(500).json({ error: "Failed to get spaces" });
    }
};

const deleteSpace = async (req, res) => {
    try {
        console.log("I am here in space deletion");
        const { id, spaceId } = req.params;
        const organization = await Organization.findByIdAndUpdate(
            id,
            { $pull: { spaces: spaceId } },
            { new: true }
        );
        console.log(organization);
        const space = await Space.findByIdAndDelete(spaceId);
        if (!space) {
            return res.status(404).json({ error: "Space not found" });
        }
        return res.status(200).json({ message: "Space deleted successfully" });
    } catch (error) {
        console.error("deleteSpace error:", error);
        return res.status(500).json({ error: "Failed to delete space" });
    }
};

const inviteMembersToSpace = async (req, res) => {
    try {
        console.log("I am here in space invitation");

        const { userId } = req.user;
        const { id, spaceId } = req.params;
        const { emails, role, message } = req.body;
        const existingUsers = await User.find({ email: { $in: emails }, _id: { $ne: userId } });
        const existingEmails = existingUsers.map(u => u.email);
        const space=await Space.findById(spaceId);

    

        await Promise.all(existingEmails.map(email => {
            emitEvent("space:invite", { organizationId: id, spaceId, data:{email,role,message,spaceName:space.name,spaceId:spaceId}});
        }));

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


export { createSpace, getSpaces, deleteSpace, inviteMembersToSpace };