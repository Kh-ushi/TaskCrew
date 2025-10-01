import Notification from "../models/Notification.js";

const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.userId, read: false }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { read: true });
        res.status(200).json({ message: "Notification marked as read" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to mark notification as read" });
    }
};

export { getAllNotifications, markAsRead };