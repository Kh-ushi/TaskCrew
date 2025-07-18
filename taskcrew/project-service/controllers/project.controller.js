import Project from "../models/Project";
import { redisClient } from "../redis/redisClient";

const createProject = async (req, res) => {
    try {

        const { name, description, ownerId, members, startDate, endDate } = req.body;
        if (!name || !ownerId || !startDate) {
            return res.status(400).json({ message: "Name, OwnerId and StartDate are required" });
        }

        const project = await Project.create({
            name,
            description,
            ownerId,
            members,
            startDate,
            endDate: endDate ? endDate : null,
        });

        await redisClient.publish("project:created", JSON.stringify({
            projectId: project._id,
            name: project.name,
            ownerId: project.ownerId,
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
        const userId = req.user.id;
        const projects = await Project.aggregate([
            {
                $match: {
                    $or: [
                        { ownerId: req.user.id },
                        { memebers: req.user.id }
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
        const userId = req.user.id;
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

        const userId = req.user.id;
        if (project.ownerId !== userId && !project.members.includes(userId)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        project.name = name || project.name;
        project.description = description || project.description;
        project.startDate = startDate || project.startDate;
        project.endDate = endDate || project.endDate;

        await project.save();
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

        const userId = req.user.id;
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

        const userId = req.user.id;
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


export { createProject, listMyProjects, getProject, updateProject, modifyMembers, archiveProject };