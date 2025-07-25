import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../config/gridfs.js";
import { uploadAttachment, listAttatchments, downloadAttachment, deleteAttachment } from "../controllers/attachment.controller.js";


const router = express.Router({ mergeParams: true });
router.use(verifyToken);

router.post("/", upload.single("file"), uploadAttachment);
router.get("/", listAttatchments);
router.get("/:attId", downloadAttachment);
router.delete("/:attId", deleteAttachment);


export default router;