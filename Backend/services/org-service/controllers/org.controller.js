import Organization from "../models/Organization.js";
import User from "../models/User.js";
import redisClient from "../redis/redisClient.js";
import Space from "../models/Space.js";

const allOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find({
            $or: [
                { owner: req.user.userId },
                { "members.userId": req.user.userId }
            ]
        }).populate('members.userId').populate("owner");

        res.status(200).json(organizations);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch organizations" });
    }
};

const getOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const organization = await Organization.findById(id).populate('members.userId');
        res.status(200).json(organization);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch the organization" });
    }
}


const addOrganization = async (req, res) => {
    try {
        console.log(req.body);
        const { name, description = "", members = [] } = req.body;
        if (!name) {
            return res.status(400).json({ error: "All Organization name is required" });
        }

        const existing = await Organization.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: "Organization with this name alreaady exists" });
        }

        const existingUsers = await User.find({ email: { $in: members } });
        const found = existingUsers.map(u => u._id);


        const foundEmail = existingUsers.map(u => u.email);
        const missing = members.filter(m => !foundEmail.includes(m));

        const newOrganization = await Organization.create({
            name,
            owner: req.user.userId,
            description
        });

        await newOrganization.populate("members.userId");
        await newOrganization.populate("owner");


        redisClient.publish("notifications", JSON.stringify({
            event: "Org:MembersAdded",
            organization: newOrganization,
            members: found
        }));

        return res.status(201).json({
            message: "Organization created successfully",
            organization: newOrganization,
            notFound: missing
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to add organization" });
    }
};

const editOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, members } = req.body
        console.log(req.body);
        const currentOrg = await Organization.findOne({ _id: id });
        const existing = await Organization.findOne({ name });
        console.log(existing);

        if (existing && existing._id.toString() !== currentOrg._id.toString()) {
            console.log("I am here");
            return res.status(400).json({ message: "Cannot edit: organization name already exists" });
        }

        await currentOrg.populate("members.userId");

        const prevMembers = currentOrg.members.map(m => m.userId.email);
        console.log(prevMembers);


        const removed = prevMembers.filter(m => !members.includes(m));
        const removedUsers = await User.find({ email: { $in: removed } });
        const removedUserIds = removedUsers.map(u => u._id);


        const added = members.filter(email => !prevMembers.includes(email));
        const addedUsers = await User.find({ email: { $in: added } });
        const addedUserIds = addedUsers.map(u => u._id);

        console.log(removedUserIds, addedUserIds);

        const updatedOrg = await Organization.findByIdAndUpdate(
            id,
            {
                name,
                description,
                $pull: { members: { userId: { $in: removedUserIds } } }
            },
            { new: true }
        );

        await updatedOrg.populate("members.userId");
        await updatedOrg.populate("owner");


        redisClient.publish("notifications", JSON.stringify({
            event: "Org:MembersAdded",
            organization: updatedOrg,
            members: addedUserIds
        }));

        redisClient.publish("notifications", JSON.stringify({
            event: "Org:MembersRemoved",
            organization: updatedOrg,
            members: removedUserIds
        }));


        res.status(201).json({
            message: "Organization details updated successfully",
            organization: updatedOrg,
        })

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update organization" });
    }
};

const deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await Organization.findById(id);
        if (!existing) {
            return res.status(404).json({ message: "Organization not found" });
        }

        const members = existing.members.map(u => u.userId);

        const deleted = await Organization.findByIdAndDelete(id);

        const spaces = await Space.find({ organization: deleted._id });

        await Promise.all(spaces.map(space => space.deleteOne()));

        redisClient.publish("notifications", JSON.stringify({
            event: "Org:Deleted",
            organization: deleted,
            members
        }));

        return res.status(200).json({
            message: "Organization deleted successfully",
            organization: existing, // sending back the deleted org if needed
        });

    } catch (error) {
        console.error("Error deleting organization:", error);
        return res.status(500).json({ error: "Failed to delete organization" });
    }

};


const inviteMembers = async (req, res) => {
    try {
        const { emails } = req.body;
        const { id } = req.params;
        const { userId } = req.user;

        const existingUsers = await User.find({ email: { $in: emails }, _id: { $ne: userId } });
        const existingIds = existingUsers.map(u => u._id.toString());

        const organization = await Organization.findById(id);
        const memberIds = organization.members.map(m => m.userId.toString());

        //Filter eligible and non-eligible IDs
        const eligibleIds = existingIds.filter(id => !memberIds.includes(id));
        const nonEligibleIds = existingIds.filter(id => memberIds.includes(id));

        // Fetch emails
        const eligibleMails = await User.find({ _id: { $in: eligibleIds } }).select("email");
        const nonEligibleMails = await User.find({ _id: { $in: nonEligibleIds } }).select("email");

        redisClient.publish("notifications", JSON.stringify({
            event: "Org:MembersAdded",
            organization: organization,
            members: eligibleIds
        }));

        res.status(200).json({
            message: `Invites have been sent`,
            sent: eligibleMails,
            existing: nonEligibleMails
        });
    } catch (error) {
        console.error("Error inviting members:", error);
        return res.status(500).json({ error: "Failed to invite members" });
    }
};


const deleteMember = async (req, res) => {
    try {
        const { email } = req.body;
        const { id } = req.params;
        const { userId } = req.user;

        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const updatedOrg = await Organization.findByIdAndUpdate(
            id,
            {
                $pull: { members: { userId: existingUser._id } }
            },
            { new: true }
        );

        const spaces = await Space.find({ organization: updatedOrg._id });

        await Promise.all(
            spaces.map(space =>
                space.updateOne({ $pull: { members: { userId: existingUser._id } } })
            )
        );


        redisClient.publish("notifications", JSON.stringify({
            event: "Org:MembersRemoved",
            organization: updatedOrg,
            members: [existingUser._id]
        }));

        return res.status(200).json({
            message: "Member removed successfully",
            member: existingUser,
            organization: updatedOrg
        });
    } catch (error) {
        console.error("❌ Error removing member:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const acceptInvite = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const organization = await Organization.findById(id);
        console.log(organization, userId, id);
        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }
        const isMember = organization.members.some(m => m.userId.toString() === userId);
        if (isMember) {
            console.log("Already a member");
            return res.status(400).json({ message: "You are already a member of this organization" });
        }
        organization.members.push({ userId });
        await organization.save();
        return res.status(200).json({ message: "You have successfully joined the organization", organization });
    }
    catch (error) {
        console.error("Error joining organization:", error);
        return res.status(500).json({ error: "Failed to join organization" });
    }
}



export { allOrganizations, getOrganization, addOrganization, editOrganization, deleteOrganization, inviteMembers, deleteMember, acceptInvite };