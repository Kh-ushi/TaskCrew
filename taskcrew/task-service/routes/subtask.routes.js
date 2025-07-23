import express from "express";
import { verifyToken } from "../middleware/auth.js";

import { getSubtasks,addSubTask ,updateSubTask,deleteSubTask,reorderSubTasks} from "../controllers/subtask.controller.js";

const router = express.Router();
router.use(verifyToken);

router.get("/",getSubtasks);
router.post("/",addSubTask);
router.patch("/:subTaskId",updateSubTask);
router.delete("/:subTaskId",deleteSubTask);
router.patch("/",reorderSubTasks);

export default router;