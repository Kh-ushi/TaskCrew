import mongoose from "mongoose";

const organizationSchema=new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
        trim:true
    },

     description:{
        type:String,
        default:""
     },
    owner:{
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

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  
},{
    timestamps:true
});

export default mongoose.model("Organization",organizationSchema);