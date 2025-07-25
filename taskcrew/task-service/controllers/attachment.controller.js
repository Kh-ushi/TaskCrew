
import Task from "../models/Task";
import { gridfsBucket } from "../config/gridfs";
import redisClient from "../redis/redisClient";

const uploadAttachment = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "File required" });
        const { taskId } = req.params;
        const { userId } = req.user;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });
        const { id: fileId, filename, contentType, size, uploadDate } = req.file;
        task.attachments.push({ fileId, filename, contentType, size, uploadDate });
        await task.save();

        redisClient.publish("attachment:added", JSON.stringify({
            userId,
            taskId,
            attachmentId: fileId,
            title: `File attached: ${filename}`,
            data: { taskId, attachmentId: fileId }
        }));

        res.status(201).json(task.attachments);
    }
    catch (error) {
        console.error("An error occured while uploading attacthment", error.message);
        res.status(500).json({ msg: "Upload failed" });
    }
};

const listAttatchments = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { userId } = req.user;
        const task = await Task.findById(taskId).select("attachments");
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.status(201).json(task.attachments);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to list attachments" });
    }
}


const downloadAttachment = async (req, res) => {
    try {
        const { taskId, attId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        const att = task.attachments.id(attId);
        if (!att) return res.status(404).json({ msg: "Attachment not found" });

        res.set("Content-Type", att.contentType);
        gridfsBucket.openDownloadStream(att.fileId).pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Download failed" });
    }
};

const deleteAttachment = async (req, res) => {
    try {
        const { taskId, attId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        const att = task.attachments.id(attId);
        if (!att) return res.status(404).json({ msg: "Attachment not found" });
        await gridfsBucket.delete(att.fileId);
        att.remove();
        await task.save();

        redisClient.publish("attachment:removed", JSON.stringify({
            userId,
            taskId,
            attachmentId: attId,
            title: `File Has Been Removed:${attId}`,
            data: { taskId, attachmentId: attId }
        }));

        res.status(201).json({ msg: "Attachment deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Deletion Failed" });
    }
};


export { uploadAttachment, listAttatchments, downloadAttachment, deleteAttachment };