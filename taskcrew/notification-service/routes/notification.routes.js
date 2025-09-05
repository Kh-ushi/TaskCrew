import express from "express";
import { verifyToken } from "../middleware/auth.js";
import{getMyNotifications,markRead} from "../controllers/notification.controller.js";

const router=express.Router({mergeParams:true});
router.use(verifyToken);

router.get("/unread",getMyNotifications);
router.post("/read",markRead);

export default router;