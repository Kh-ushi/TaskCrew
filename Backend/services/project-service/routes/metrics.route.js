import express from "express";

import { calcProjectMetrics, calculateSpaceMterics, calculateSpaceMtericsDeep } from "../controllers/metrics.controller.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();
router.use(authenticate);
router.get("/:projectId", calcProjectMetrics);


export default router;