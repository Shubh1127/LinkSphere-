import mongoose from "mongoose";

const postSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    body:{
        type:String,
        required:true

    },
    likes:{
        type:Number,
        default:0

    },
    createdAt:{
        type:Date,
        default:Date.now

    },
    updatedAt:{
            type:Date,
            default:Date.now
    },
    media:{
        type:String,
        default:''

    },
    active:{
        type:Boolean,
        default:true

    },
    fileType:{
        type:String,
        default:''

    },

   
})
const post=mongoose.model("post",postSchema)

export default post