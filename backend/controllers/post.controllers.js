import User from "../models/user.model.js"
import Post from  '../models/post.model.js';
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
        // const {token}=req.body;
        const posts=await Post.find().populate("userId","username email profilePicture");
        return res.status(200).json({posts:posts})

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}
export const deletePost=async(req,res)=>{
    try{
        const {token,post_id}=req.body;
        const user=await User.findOne({token:token})
        .select({_id});
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        
        const post=await Post.findOne({_id:post_id});
        if(!post){
            return res.status(400).json({message:"Post not found"})
        }
       post.userId.toString() !== user._id.toString() ? res.status(400).json({message:"You can't delete this post"}):null;

       await Post.deletePost({_id:post_id});
       return res.status(200).json({message:"Post deleted"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}