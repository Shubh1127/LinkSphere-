import mongoose from "mongoose";
const commentsSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }
})
const Comment=mongoose.model("comments",commentsSchema)

export default Comment;