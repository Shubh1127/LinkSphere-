import User from "../models/user.model.js"
import Post from  '../models/post.model.js';
export const activecheck=async(req,res)=>{
    return res.status(200).json({message:"Running"})
}

export const createPost=async(req,res)=>{
    const {token}=req.body;
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