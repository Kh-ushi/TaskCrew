import Project from "../models/Project.js";
import redisClient from "../redis/redisClient.js";

const getAllProjects = async (req, res) => {
    try {
        const { spaceId } = req.params;
        const { userId } = req.user;
        console.log(userId);

        const projects = await Project.find({
            spaceId,
            $or: [
                { ownerId: userId },
                { members: userId.toString() }
            ]
        });

        res.status(200).json(projects);
    } catch (error) {
        console.error("❌ Error fetching projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);
        res.status(200).json(project);
    }
    catch (error) {
        console.error("❌ Error fetching projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const createProject = async (req, res) => {

    try {
        const { name, description = "", status, startDate, endDate } = req.body;
        const { spaceId } = req.params;
        const { userId } = req.user;

        if (!name || !startDate) {
            return res.status(400).json({ message: "Name and StartDate are required" });
        }

        const existingProject = await Project.findOne({ name, spaceId });
        if (existingProject) {
            return res.status(400).json({ message: "Project with same name already exists" });
        }

        const project = await Project.create({
            name,
            description,
            ownerId: userId,
            startDate,
            endDate: endDate ? endDate : null,
            spaceId,
            status
        });

        res.status(201).json({
            message: "Project Created Successfully",
            project
        });
    }
    catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ message: "Project Creation failed" });
    }
};

const editProject = async (req, res) => {
    try {
        const { name, description = "", status,state, startDate, endDate } = req.body;
        const { id } = req.params;
        const { userId } = req.user;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Authorization check
        if (project.ownerId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to edit this project" });
        }

        const updatedData = {};

        if (name && name.trim() !== "" && name.trim() !== project.name.trim()) {
            updatedData.name = name;
        }
        if (description && description.trim() !== project.description?.trim()) {
            updatedData.description = description;
        }
        if (status && status !== project.status) {
            updatedData.status = status;
        }
        if (state && state !== project.state) {
            updatedData.state= state;
        }
        if (startDate && startDate !== project.startDate?.toISOString()) {
            updatedData.startDate = startDate;
        }
        if (endDate && endDate !== project.endDate?.toISOString()) {
            updatedData.endDate = endDate;
        }

        if (Object.keys(updatedData).length === 0) {
            return res.status(200).json({ message: "No changes detected" });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true }
        );

        return res.status(200).json({
            message: "Project updated successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("❌ Error editing project:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteProject = async (req, res) => {

    try {
        const { id } = req.params;
        const { userId } = req.user;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Authorization check
        if (project.ownerId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this project" });
        }

        const deletedProject = await Project.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Project deleted successfully",
            project: deletedProject,
        });
    }
    catch (error) {
        console.error("❌ Error editing project:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

const addMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { members } = req.body;
        const { userId } = req.user;

        if (!members || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({ message: "Members array is required" });
        }

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.ownerId.toString().trim() !== userId.toString().trim()) {
            return res.status(403).json({ message: "Not authorized to perform this action" });
        }

        members.forEach((member) => {
            const memberId = member.toString();
            if (!project.members.includes(memberId)) {
                project.members.push(memberId);
            }
        });

        await project.save();

        return res.status(200).json({
            message: "Members added successfully",
            project,
        });
    } catch (error) {
        console.error("Error adding members:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteMember = async (req, res) => {
  try {
    const { id ,memberId} = req.params;
    const { userId } = req.user;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.ownerId.toString().trim() !== userId.toString().trim()) {
      return res.status(403).json({ message: "Not authorized to perform this action" });
    }

    await Project.findByIdAndUpdate(id, {
      $pull: { members: memberId }
    });

    return res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing member:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export { getAllProjects, getProjectById, createProject, editProject, deleteProject, addMember, deleteMember };