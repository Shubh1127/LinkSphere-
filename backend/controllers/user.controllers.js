import User from "../models/user.model.js"
import Profile from "../models/profile.model.js"
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import PDFDocument from 'pdfkit'
import fs from 'fs'

const convertUserDataTOPDF= (userData)=>{

    const doc=new PDFDocument();

    const outputPath=crypto.randomBytes(32).toString('hex')+ ".pdf";
    const stream =fs.createWriteStream('uploads/'+outputPath)

    doc.pipe(stream)
    doc.image(`uplaods/${userData.userId.profilePicture}`,{align:"center",width:100})
}

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
         const userProfile=await Profile.findOne({userId:user._id})
         .populate('userId','name email username profilePicture');

         return res.json(userProfile)


    }catch(err){
        return res.josn({message:err.message})
    }
}

export const updatePofileData=async(req,res)=>{
    try{
         const {token,...newPofileData}=req.body;
         const userProfile=await User.findOne({token:token});
         if(!userProfile){
            return res.status(404).json({message:"User not found"})
         }
         const profile_to_update=await Profile.findOne({userId:userProfile._id})

         Object.assign(profile_to_update,newPofileData)

         await profile_to_update.save();

         return res.status(200).json({message:"Profile updated"})

    }catch(err){
        return res.json({message:err.message})
    }
}

export const getAllUserProfile=async(req,res)=>{
    try{

        const profiles=await Profile.find().populate('userId','name username email profilePicture')
        return res.json({profiles})
    }catch(err){
        return res.json({message:err.message})
    }
}

export const downloadProfile=async(req,res)=>{

    const user_id=req.query.id;
    const userProfile=await Profile.findOne({userId:user_id})
    .populate('userId','name email username profilePicture')

    let a =await convertUserDataTOPDF(userProfile)

    return res.json({'message':a})


}