import Space from "../models/Space.js";
import Organization from "../models/Organization.js";

const createSpace = async (req, res) => {
    try {
        const { userId } = req.user;
        const { id} = req.params;
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
            orgId:id,
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
        const {id}=req.params;
        const spaces = await Space.find({$or:[{ownerId:userId},{"members.userId":userId}],orgId:id});
        console.log(spaces);
        return res.status(200).json({ spaces });
    } catch (error) {
        console.error("getSpaces error:", error);
        return res.status(500).json({ error: "Failed to get spaces" });
    }
};

const deleteSpace = async (req, res) => {
    try {
        const { id } = req.params;
        const space = await Space.findByIdAndDelete(id);
        if (!space) {
            return res.status(404).json({ error: "Space not found" });
        }
        return res.status(200).json({ message: "Space deleted successfully" });
    } catch (error) {
        console.error("deleteSpace error:", error);
        return res.status(500).json({ error: "Failed to delete space" });
    }
};



export { createSpace, getSpaces, deleteSpace };