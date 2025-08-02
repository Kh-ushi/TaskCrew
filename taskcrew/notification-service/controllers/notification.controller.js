import Notification from "../models/Notification.js";

const getMyNotifications = async (req, res) => {
    try {
        const { userId } = req.user;
        const list = await Notification
            .find({ userId })
            .sort({ createdAt: 1 })
            .limit(10)

        res.status(201).json(list);

    } catch (error) {
        console.error("An error has occured in fetching all notifications", error);
        res.status(500).json({ message: "Internal Server error" });
    }

};

const markRead = async (req, res) => {
    try {
        const { ids } = req.body;
        const { userId } = req.user;
        await Notification.updateMany(
            { userId, _id: { $in: ids } },
            { isRead: true }
        );

        res.status(201).json({message:"notification updated successfully"});

    } catch (error) {
       console.error("An error has occured in updating notifications", error);
        res.status(500).json({ message: "Internal Server error" });
    }
};


export { getMyNotifications, markRead };
