import express from "express";

const router = express.Router();
import { getAllNotifications, markAsRead } from "../controllers/notif.controller.js";
import authenticate from "../middlewares/authenticate.js";

router.use(authenticate);

router.get("/", getAllNotifications);
router.put("/mark-as-read/:id", markAsRead);

export default router;
