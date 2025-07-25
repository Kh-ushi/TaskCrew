import express from "express";
import { verifyToken } from "../middleware/auth.js";

import { getSubtasks, addSubTask, updateSubTask, deleteSubTask, reorderSubTasks, addComment,deleteComment} from "../controllers/subtask.controller.js";

const router = express.Router({mergeParams:true});
router.use(verifyToken);

router.get("/", getSubtasks);
router.post("/", addSubTask);
router.patch("/", reorderSubTasks);
router.patch("/:subTaskId", updateSubTask);
router.delete("/:subTaskId", deleteSubTask);
router.post("/:subTaskId/comments", addComment);
router.delete("/:subTaskId/comments/:commentId",deleteComment);



export default router;