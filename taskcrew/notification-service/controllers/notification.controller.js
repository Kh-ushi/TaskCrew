import Notification from "../models/Notification.js";

const getMyNotifications = async (req, res) => {
    try {
        console.log("I am in getMyNotifications");
        const {email}=req.user;
        if(!email){
            return res.status(400).json({message:"Email not found in token"});
        }
        const notifications=await Notification.aggregate([
            {$match:{email,isRead:false,isJoin:true}},
            {$sort:{createdAt:-1}},
            {$group:{
                _id:"$title",
                doc:{$first:"$$ROOT"},
            }},
            { $replaceRoot: { newRoot: "$doc" } }, 
            {$sort:{createdAt:-1}},
        ]);
        console.log(notifications);
        res.status(201).json({notifications});
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
