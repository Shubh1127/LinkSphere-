import User from "../models/user.model.js"
import Post from  '../models/post.model.js';
import Comment from "../models/comments.model.js";
export const activecheck=async(req,res)=>{
    return res.status(200).json({message:"Running"})
}

export const createPost=async(req,res)=>{
    const token=req.cookies.token;
    try{
        const user=await User.findOne({token:token});
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const post=new Post({
            userId:user._id,
            body:req.body.body,
            media:req.file !=undefined ? req.file.filename : "",
            fileTypoe:req.file !=undefined ? req.file.mimetype.split("/") : "",
        })

        await post.save();
        return res.status(201).json({message:"Post created"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const getAllPost=async(req,res)=>{
    try{
        const posts=await Post.find()
            .populate("userId", "username name email profilePicture")
            .populate({
                path: "comments",
                populate: { path: "userId", select: "username name profilePicture" }
            });
        return res.status(200).json({ posts });
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}
export const deletePost=async(req,res)=>{
    try{
        const token=req.cookies.token;
        // console.log("Token received:", token);
        const {post_id}=req.body;
        // console.log("Post ID received:", post_id);
        const user=await User.findOne({token:token})
        .select("_id");
        // console.log("User found:", user);
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        
        const post=await Post.findOne({_id:post_id});
        // console.log("Post found:", post);
        if(!post){
            return res.status(400).json({message:"Post not found"})
        }
       post.userId.toString() !== user._id.toString() ? res.status(400).json({message:"You can't delete this post"}):null;

       await Post.deleteOne({_id:post_id});
        // console.log("Post deleted successfully");
       return res.status(200).json({message:"Post deleted"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const increment_Likes = async (req, res) => {
    try {
        const { post_id } = req.body;
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (!post_id) {
            return res.status(400).json({ message: "Post ID is required" });
        }
        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(400).json({ message: "Post not found" });
        }

        // Use likedBy array for user IDs
        if (post.likedBy.includes(user._id)) {
            post.likedBy = post.likedBy.filter(
                id => id.toString() !== user._id.toString()
            );
        } else {
            post.likedBy.push(user._id);
        }
        post.likes = post.likedBy.length;
        post.updatedAt = Date.now();

        await post.save();
        return res.status(200).json({ likes:post.likes, likedBy: post.likedBy, message: "Post liked/unliked successfully" });
    } catch (err) {
        console.error("Error in increment_Likes:", err);
        return res.status(500).json({ message: err.message });
    }
};

export const commentPost=async(req,res)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        const user=await User.findOne({token:token})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const {post_id,comment}=req.body;
        if(!post_id || !comment){
            return res.status(400).json({message:"Post ID and comment are required"})
        }
        const post=await Post.findOne({_id:post_id});
        if(!post){
            return res.status(400).json({message:"Post not found"})
        }
        const newComment={
            userId:user._id,
            postId:post._id,
            body:comment
        }
        const commentPost=await Comment.create(newComment);
        post.comments.push(commentPost._id);
        post.updatedAt=Date.now();
        await post.save(); 
        return res.status(201).json({message:"Comment added successfully", comment:commentPost});
    }catch(err){
        console.error("Error in commentPost:", err);
        return res.status(500).json({message:err.message})
    }
}

export const getAllComments=async(req,res)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        const user=await User.findOne({token:token})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const comments=await Comment.find()
        return res.status(200).json({comments});
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const getCommentsByPostId=async(req,res)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        const {postId}=req.params;
        if(!postId){
            return res.status(400).json({message:"Post ID is required"})
        }
        const comments=await Comment.find({postId:postId}).populate("userId","username name profilePicture");
        return res.status(200).json({comments});

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const deleteComment=async(req,res)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        const user=await User.findOne({token:token});
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const {comment_id}=req.body;
        if(!comment_id){
            return res.status(400).json({message:"Comment ID is required"})
        }
        const comment=await Comment.findOne({_id:comment_id});
        if(!comment){
            return res.status(400).json({message:"Comment not found"})
        }
        if(comment.userId.toString() !== user._id.toString()){
            return res.status(400).json({message:"You can't delete this comment"})
        }
        await Comment.deleteOne({_id:comment_id});
        return res.status(200).json({message:"Comment deleted successfully"});
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}