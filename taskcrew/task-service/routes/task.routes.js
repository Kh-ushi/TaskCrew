import express from "express";
import { verifyToken } from "../middleware/auth.js";

import { createTask,getTasksByProject,getMyTasks,getTaskById,updateTask,deleteTask} from "../controllers/task.controller.js";

const router=express.Router({mergeParams:true});

router.use(verifyToken);

router.post("/",createTask);
router.get("/:projectId",getTasksByProject);
router.get("/my",getMyTasks);
router.get("/:taskId",getTaskById);
router.put("/:taskId",updateTask);
router.delete("/:taskId",deleteTask);


export default router;