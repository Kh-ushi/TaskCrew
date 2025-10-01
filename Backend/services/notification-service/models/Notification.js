import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema({

    recipient:{
        type:"String",
        required:true,
        required:true,
        index:true
    },
    message:{
        type:"String",
        required:true
    },
     type: {
      type: String,
      enum: [
        "Org:MembersAdded",
        "Task:Assigned",
        "Project:Deadline",
        "Comment:Mention",
        "Custom",
      ],
      default: "Custom",
    },

    entity: {
      type:String,
      refPath: "entityModel",
    },
    entityModel: {
      type: String,
      enum: ["Organization", "Task", "Project", "Comment"],
    },
    read:{
        type:Boolean,
        default:false,
        index:true
    },

},{timestamps:true});

const Notification=mongoose.model("Notification",notificationSchema);

export default Notification;