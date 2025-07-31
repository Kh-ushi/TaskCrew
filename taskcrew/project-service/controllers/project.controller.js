import Project from "../models/Project.js";
import redisClient from "../redis/redisClient.js";

const createProject = async (req, res) => {
    try {

        const { name, description, members, startDate, endDate } = req.body;
        if (!name || !startDate) {
            return res.status(400).json({ message: "Name and StartDate are required" });
        }

        const project = await Project.create({
            name,
            description,
            ownerId:req.user.userId,
            members,
            startDate,
            endDate: endDate ? endDate : null,
        });

        await redisClient.publish("project:created", JSON.stringify({
            userId: project.ownerId,
            watchers: project.members,
            projectId: project._id,
            title: `Project "${project.name}" created`,
            startDate: project.startDate,
            endDate: project.endDate,
        }));

        return res.status(201).json(project);

    }
    catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

};

const listMyProjects = async (req, res) => {
    try {
        const userId = req.user.userId;
        const projects = await Project.aggregate([
            {
                $match: {
                    $or: [
                        { ownerId: userId },
                        { members: userId }
                    ],
                    status: "active"
                }
            },
            {
                $addFields: {
                    sortEndDate: {
                        $cond: [
                            { $ifNull: ["$endDate", false] },
                            "$endDate",
                            new Date("2999-12-31")
                        ]

                    }
                }
            },

            {
                $sort: {
                    sortEndDate: 1,
                    updatedAt: -1
                }
            }
        ]);

        res.status(201).json(projects);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Failed to fetch projects" });
    }
}

const getProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ message: "Not found" });
        const userId = req.user.userId;
        if (project.ownerId !== userId && !project.members.includes(userId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, startDate, endDate } = req.body;
        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ message: "Not found" });

        const userId = req.user.userId;
        if (project.ownerId !== userId && !project.members.includes(userId)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        project.name = name || project.name;
        project.description = description || project.description;
        project.startDate = startDate || project.startDate;
        project.endDate = endDate || project.endDate;

        await project.save();

        await redisClient.publish("project:updated", JSON.stringify({
            userId: project.ownerId,
            watchers: project.members,
            projectId: project._id,
            title: `Project "${project.name}" has new updates`,
            startDate: project.startDate,
            endDate: project.endDate,
        }));

        res.status(201).json({ message: "Project Updated Successfully" });

    }
    catch (error) {
        res.status(500).json({ error: err.message });
    }

};

const modifyMembers = async (req, res) => {

    try {
        const { id } = req.params;
        const { add = [], remove = [] } = req.body;
        const project = Project.findById(id);
        if (!project) return res.status(404).json({ message: "Not found" });

        const userId = req.user.userId;
        if (project.ownerId !== userId && !project.members.includes(userId)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        add.forEach(uid => {
            if (uid != project.ownerId && !project.memebrs.includes(uid)) {
                project.members.push(uid);
            }
        });

        project.members = project.memebers.filter(uid => !remove.includes(uid));
        await project.save();

        if (add.length > 0) {
            await redisClient.publish("project:membersAdded", JSON.stringify({
                watchers: add,
                projectId: project._id,
                title: `You've been added to project "${project.name}"`,
                message: `Welcome to the project`,
                data: { projectId: project._id }
            }));
        }

        if (remove.length > 0) {
            await redisClient.publish("project:membersRemoved", JSON.stringify({
                watchers: remove,
                projectId: project._id,
                title: `You've been removed from project "${project.name}"`,
                message: `Access revoked`,
                data: { projectId: project._id }
            }));
        }

        res.status(201).json({ message: "Members Updated Successfully" });


    }
    catch (error) {
        res.status(500).json({ error: err.message });
    }

}

const archiveProject = async (req, res) => {

    try {
        const { id } = req.params;
        const project = Project.findById(id);
        if (!project) return res.status(404).json({ message: "Not found" });

        const userId = req.user.userId;
        if (project.ownerId !== userId && !project.members.includes(userId)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        project.status = "archived";
        await project.save();
        res.status(201).json({ message: "Project archived" });
    }
    catch (error) {
        res.status(500).json({ error: err.message });
    }

};

const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.user.userId;

        const project = Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.ownerId !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Project.findByIdAndDelete(projectId);
        await redisClient.publish("project:deleted", JSON.stringify({
            projectId,
            deletedBy: userId,
            title: `${project.name} has been deleted`,
            watchers: project.members
        }));

        res.status(201).json({ message: "Project deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting project:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export { createProject, listMyProjects, getProject, updateProject, modifyMembers, archiveProject, deleteProject };