import express from "express";
import validationRequest from "../middlewares/validationRequest.js";
import { allTasks, createTask, editTask, deleteTask, addAssignees, removeAssignee, updateTaskStatus } from "../controllers/task.controller.js";
import { createTaskSchema, editTaskSchema, addAssigneeSchema } from "../validations/taskSchema.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router({ mergeParams: true });

router.use(authenticate);

router
    .route("/project/:projectId")
    .get(allTasks)
    .post(validationRequest(createTaskSchema), createTask);

router
    .route("/:taskId/remove/:assigneeId")
    .delete(removeAssignee);

router
    .route("/:taskId/status")
    .patch(updateTaskStatus);

router
    .route("/:taskId")
    .post(validationRequest(addAssigneeSchema), addAssignees)
    .put(validationRequest(editTaskSchema), editTask)
    .delete(deleteTask)



export default router;