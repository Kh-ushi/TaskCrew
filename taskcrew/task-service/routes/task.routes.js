import express from "express";
import { verifyToken } from "../middleware/auth.js";

import { createTask,getTasksByProject,getMyTasks} from "../controllers/task.controller.js";

const router=express.Router();

router.use(verifyToken);

router.post("/",createTask);
router.get("/:projectId",getTasksByProject);
router.get("/my",getMyTasks);


export default router;