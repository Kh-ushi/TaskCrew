
import Task from "../models/Task";
import { gridfsBucket } from "../config/gridfs";

const uploadAttachment = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "File required" });
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });
        const { id: filedId, filename, contentType, size, uploadDate } = req.file;
        task.attachments.push({ filedId, filename, contentType, size, uploadDate });
        await task.save();

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
    } catch (error) {

    }
};


export { uploadAttachment, listAttatchments, downloadAttachment };