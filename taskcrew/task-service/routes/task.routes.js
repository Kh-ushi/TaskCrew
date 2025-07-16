import express from "express";
import { verifyToken } from "../middleware/auth.js";

import { createTask } from "../controllers/task.controller.js";

const router=express.Router();

router.use(verifyToken);

router.post("/",createTask);

export default router;