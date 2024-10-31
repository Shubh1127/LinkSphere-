import User from "../models/user.model.js"
import Profile from "../models/profile.model.js"
import bcrypt from 'bcrypt'
import crypto from 'crypto'

export const register=async(req,res)=>{
    // res.send("working")
    try{
        let {name,email,username,password}=req.body;
        if(!name || !email || !username || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user=await User.findOne({
            email
        })
        if(user){
            return res.status(400).json({message:"User already exist"})
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            name,
            email,
            username,
            password:hashedPassword,
        })
        await newUser.save();
        console.log(newUser)
        
        const profile=new Profile({
            userId:newUser._id,
        })
        await profile.save();
        return res.json({message:"User Created"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const login=async(req,res)=>{
    try{

        let {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user=await User.findOne({
            email
        })
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const token=crypto.randomBytes(32).toString("hex");
        await User.updateOne({_id:user._id},{token})
        console.log("user logged in",user.username)
        return res.json({token})
    }catch(err){
        return res.status(400).json({message:err.message})
    }

}
export const uploadProfilePicture=async(req,res)=>{

    const {token}=req.body;
    try{

        const user=await User.findOne({token:token})

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        user.profilePicture=req.file.filename;
        await user.save();
        
        return res.json({message:"Profile Picture Updated"})

    }catch(err){
        return res.status(400).json({message:err.message})
    }
}
export const updateUserProfile=async(req,res)=>{
     try{
        const {token,...newUserData}=req.body;
        const user=await User.findOne({token:token});
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const {username,email}=newUserData;
        const existingUser=await User.findOne({$or:[{username},{email}]})

        if(existingUser){

            if(existingUser || String(existingUser._id) !==String(user._id)){
                return res.status(400).json({message:"User already exists"})
            }
        }
        Object.assign(user,newUserData);
        await user.save();
     }catch(err){
        res.status(500).json({message:err.message})
     }

}
export const getUserAndProfile =async(req,res)=>{
    const {token}=req.body;
    try{
        const user=await User.findOne({token:token});
        if(!user){
            return res.status(404).json({message:"user not found"})
        }


    }catch(err){p
        return res.josn({message:err.message})
    }
}