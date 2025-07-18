import express from "express";
import { verifyToken } from "../middleware/auth.js";

import { addSubTask ,updateSubTask,deleteSubTask} from "../controllers/subtask.controller.js";

const router = express.Router();
router.use(verifyToken);

router.post("/",addSubTask);
router.patch("/:subTaskId",updateSubTask);
router.delete("/:subTaskId",deleteSubTask);

export default router;