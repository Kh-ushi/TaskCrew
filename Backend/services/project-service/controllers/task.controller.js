import Project from "../models/Project.js";
import Task from "../models/Task.js";
import TaskActivity from "../models/TaskActivity.js";
import redisClient from "../redis/redisClient.js";


const allTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.user;

    const tasks = await Task.find({
      projectId,
      $or: [{ createdBy: userId }, { assignedTo: userId }],
    }).sort({ createdAt: -1 }); // optional: newest first

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found for this project",
        tasks: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.user;
    const {
      title,
      description,
      assignedTo,
      status,
      priority,
      startDate,
      endDate,
    } = req.body;

    const newTask = await Task.create({
      projectId,
      title,
      description,
      assignedTo,
      createdBy: userId.toString(),
      status,
      priority,
      startDate,
      endDate: endDate || null,
      completedAt: status == "done" ? new Date() : null
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const editTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.user;
    const updates = req.body;
    
    if(updates?.status=="done" && updates.completedAt==null){
      updates.completedAt=new Date()
    }
    if(updates.status=="to-do" || updates.status=="in-progress"){
      updates.completedAt=null
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to edit this task" });
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.user;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this task",
      });
    }

    const deletedTask = await Task.findByIdAndDelete(taskId);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task: deletedTask
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const addAssignees = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.user;
    const { assignees } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to add assignees to this task",
      });
    }

    const newAssignees = assignees.filter(
      (assignee) => !task.assignedTo.includes(assignee)
    );

    if (newAssignees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All provided assignees are already assigned to this task",
      });
    }

    task.assignedTo.push(...newAssignees);
    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: "Assignees added successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error adding assignees:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const removeAssignee = async (req, res) => {
  try {
    const { taskId, assigneeId } = req.params;
    const { userId } = req.user;


    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to remove assignee from this task",
      });
    }


    if (!task.assignedTo.includes(assigneeId)) {
      return res.status(400).json({
        success: false,
        message: "This assignee is not assigned to the task",
      });
    }

    task.assignedTo = task.assignedTo.filter(
      (member) => member.toString() !== assigneeId.toString()
    );

    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: "Assignee removed successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error removing assignee:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.user;
    const { status } = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const prev = task.status;
    task.status = status;
    if (status == "done") {
      task.completedAt = new Date();
    }
    const updated = await task.save();

    const activity = await TaskActivity.create({
      taskId,
      projectId: task.projectId,
      actorId: userId,
      type: "task.status.changed",
      from: prev,
      to: status,
      fieldsChanged: ["status"]
    });

    const evt = {
      event: "task.status.changed",
      ts: Math.floor(Date.now() / 1000),
      actorId: userId,
      projectId: task.projectId?.toString(),
      data: { taskId: task._id.toString(), from: prev, to: status }
    };

    await redisClient.publish("task.events", JSON.stringify(evt));

    res.status(201).json({
      message: "Task Status Updated Successfully",
      task: updated,
      activity
    });

  }
  catch (error) {
    console.log("Error occured", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export { allTasks, createTask, editTask, deleteTask, addAssignees, removeAssignee, updateTaskStatus };
