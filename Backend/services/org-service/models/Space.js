import mongoose from "mongoose";

const spaceSchema=new mongoose.Schema({

    organization:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organization",
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        default:""
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
     members:[
           {
               userId:{
                   type:mongoose.Schema.Types.ObjectId,
                   ref:"User"
               },
               role:{
                   type:String,
                   enum:["admin","member","client"],
                   default:"member"
               },
               joinedAt:{
                   type:Date,
                   default:Date.now
               }
           }
       ],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }

},{timestamps:true});


const Space=mongoose.model("Space",spaceSchema);

export default Space;