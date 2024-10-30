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

        const profile=new Profile({
            userId:newUser._id,
        })
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
        const user=User.findOne({
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
        return res.json({token})
    }catch(err){
        return res.status(400).json({message:err.message})
    }

}