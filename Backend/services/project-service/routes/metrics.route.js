import express from "express";

import { calcProjectMetrics, calculateSpaceMterics, calculateSpaceMtericsDeep,overAllProjectMetrics,getProjectProgressLast4Weeks} from "../controllers/metrics.controller.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();
router.use(authenticate);
router.get("/:projectId", calcProjectMetrics);
router.get("/space/:spaceId",overAllProjectMetrics);
router.get("/progress/:spaceId",getProjectProgressLast4Weeks);

export default router;