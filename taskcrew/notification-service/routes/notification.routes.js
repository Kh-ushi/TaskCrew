import express from "express";
import { verifyToken } from "../middleware/auth";
import{getMyNotifications,markRead} from "../controllers/notification.controller";

const router=express.Router({mergeParams:true});
router.use(verifyToken);

router.get("/",getMyNotifications);
router.post("/read",markRead);

export default router;