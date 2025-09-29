import Space from "../models/Space.js";
import User from "../models/User.js";
import redisClient from "../redis/redisClient.js";



const allSpaces = async (req, res) => {
    try {
        const { id } = req.params;
        const allSpaces = await Space.find({
            organization: id,
            $or: [
                { ownerId: req.user.userId },
                { "members.userId": req.user.userId }
            ]
        });
        res.status(200).json(allSpaces);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch all spaces" });
    }
};

const getSpace = async (req, res) => {
    try {
        const { id, spaceId } = req.params;
        const space = await Space.findOne({ _id: spaceId });
        res.status(200).json(space);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch the space" });
    }
}


const createSpace = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, description, members = [] } = req.body;

        const existing = await Space.findOne({ name, organization: id });
        if (existing) {
            return res.status(400).json({ message: "Space with this name alreaady exists in this organization" });
        }

        const allMembers = await User.find({ email: { $in: members } });
        const membersIds = allMembers.map(m => m._id);


        const newSpace = await Space.create({
            organization: id,
            name,
            description,
            ownerId: req.user.userId,
        });

        redisClient.publish("notifications", JSON.stringify({
            event: "Space:MembersAdd",
            space: newSpace,
            members: membersIds
        }));

        return res.status(201).json({
            message: "Space created successfully",
            space: newSpace
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to create space" });
    }
};

const editSpace = async (req, res) => {
    try {
        const { id, spaceId } = req.params;
        const { name, description, members } = req.body;
        const currentSpace = await Space.findById(spaceId);
        const existing = await Space.findOne({ name, organization: id });
        if (existing && existing._id.toString() !== currentSpace._id.toString()) {
            return res.status(400).json({ message: "Cannot edit: space name already exists" });
        }

        await currentSpace.populate("members.userId");

        const prevMembers = currentSpace.members.map(m => m.userId.email);

        const removed = prevMembers.filter(m => !members.includes(m));
        const removedUsers = await User.find({ email: { $in: removed } });
        const removedUserIds = removedUsers.map(u => u._id);


        const added = members.filter(email => !prevMembers.includes(email));
        const addedUsers = await User.find({ email: { $in: added } });
        const addedUserIds = addedUsers.map(u => u._id);


        const updatedSpace = await Space.findByIdAndUpdate(spaceId,
            {
                name,
                description,
                $pull: { members: { userId: { $in: removedUserIds } } }
            },
            { new: true });

        redisClient.publish("notifications", JSON.stringify({
            event: "Space:MembersAdd",
            space: updatedSpace,
            members: addedUserIds
        }));

        redisClient.publish("notifications", JSON.stringify({
            event: "Space:MembersDelete",
            space: updatedSpace,
            members: removedUserIds
        }));

        res.status(201).json({
            message: "Space details updated successfully",
            space: updatedSpace
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update space" });
    }
};


const deleteSpace = async (req, res) => {
    try {

        const { spaceId } = req.params;

        const existing = await Space.findById(spaceId);
        if (!existing) {
            return res.status(404).json({ message: "Space not found" });
        }

        const deletedSpace = await Space.findByIdAndDelete(spaceId);
        console.log(deletedSpace);

        const members = deletedSpace.members.map(u => u.userId);

        redisClient.publish("notifications", JSON.stringify({
            event: "Space:Deleted",
            space: deletedSpace,
            members
        }));

        return res.status(200).json({
            message: "Space deleted successfully",
            space: deletedSpace,
        });
    }
    catch (error) {
        console.error("Error deleting organization:", error);
        return res.status(500).json({ error: "Failed to delete the space" });
    }
};

const inviteMembers = async (req, res) => {
    try {
        const { emails } = req.body;
        const { spaceId } = req.params;
        const { userId } = req.user;

        const existingUsers = await User.find({ email: { $in: emails }, _id: { $ne: userId } });
        const existingIds = existingUsers.map(u => u._id);

        const space = await Space.findById(spaceId);

        redisClient.publish("notifications", JSON.stringify({
            event: "Space:MembersAdd",
            space,
            members: existingIds
        }));

        res.status(200).json({
            message: "Inviations sent succesfully",
            sent: existingUsers
        });


    }
    catch (error) {
        console.error("Error inviting members:", error);
        return res.status(500).json({ error: "Failed to invite members" });
    }
};

const deleteMember = async (req, res) => {
    try {
        const { email } = req.body;
        const { spaceId } = req.params;
        const { userId } = req.user;

        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedSpace = await Space.findByIdAndUpdate(spaceId, {
            $pull: { members: { userId: existingUser._id } }
        }, {
            new: true
        }
        );

        redisClient.publish("notifications", JSON.stringify({
            event: "Space:MembersDelete",
            space: updatedSpace,
            members: [existingUser._id]
        }));

        res.status(200).json({
            message: "Member has been deleted from space",
            space: updatedSpace,
            member: existingUser
        });

    }
    catch (error) {
        console.error("Error delteing member:", error);
        return res.status(500).json({ error: "Failed to delete members" });
    }
};

export { allSpaces, getSpace, createSpace, editSpace, deleteSpace, inviteMembers, deleteMember };