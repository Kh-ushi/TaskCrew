import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validationRequest.js";
import { taskSchema } from "../validations/taskSchema.js"
import { createTask, getTasksByProject, getMyTasks, getTaskById, updateTask, deleteTask } from "../controllers/task.controller.js";

const router = express.Router({ mergeParams: true });

router.use(verifyToken);
router.get("/:projectId/my", getMyTasks);
router.post("/:projectId", validateRequest(taskSchema), createTask);
router.get("/:projectId", getTasksByProject);
router.get("/:taskId", getTaskById);
router.put("/:taskId",validateRequest(taskSchema), updateTask);
router.delete("/:taskId", deleteTask);


export default router;