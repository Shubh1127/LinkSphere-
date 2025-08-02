import User from "../models/user.model.js"
import Profile from "../models/profile.model.js"
import ConnectionRequest from "../models/connections.model.js"
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import Post from "../models/post.model.js"
import Comment from "../models/comments.model.js"

const convertUserDataTOPDF = async (userData) => {
    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(32).toString('hex') + ".pdf";
    const stream = fs.createWriteStream('uploads/' + outputPath);

    doc.pipe(stream);

    // Set image at a specific position
    doc.image(`uploads/${userData.userId.profilePicture}`, 200, 50, {
        width: 100,
        height: 100
    });

    // Move the text down to prevent overlap
    let textStartY = 180; // Set text to start below the image

    doc.fontSize(14).text(`Name: ${userData.userId.name}`, 50, textStartY);
    doc.text(`Username: ${userData.userId.username}`);
    doc.text(`Email: ${userData.userId.email}`);
    doc.text(`Bio: ${userData.bio}`);
    doc.text(`Current Position: ${userData.currentPost}`);

    doc.moveDown();
    doc.text("Past work:");

    userData.pastWork.forEach((work) => {
        doc.moveDown(0.5);
        doc.text(`Company name: ${work.company}`);
        doc.text(`Position: ${work.position}`);
        doc.text(`Years: ${work.years}`);
        doc.moveDown();
    });

    doc.end();

    return outputPath;
};


export const register=async(req,res)=>{
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
        // console.log(newUser)
        
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
        // console.log(req.body)
        let {identifier,password}=req.body;
        if(!identifier || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        let user;
        if(identifier.includes("@")){
            user=await User.findOne({email:identifier});
        }else{
            user=await User.findOne({username:identifier})
        }
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const token=crypto.randomBytes(32).toString("hex");
        const tokenExpiresAt=new Date(Date.now()+90*24*60*60*1000)//90 days
        await User.updateOne({_id:user._id},{token,tokenExpiresAt})
        res.cookie("token",token,{
            httpOnly:true,
            secure: false, // Set to true in production
            sameSite:'lax',
            maxAge:90*24*60*60*1000 //90 days
        })
        console.log(req.cookies)
        console.log("user: ",user.username)
        return res.json({message:"Login successful",user:user})
    }catch(err){
        return res.status(500).json({message:err.message})
    }

}

export const logout=async(req,res)=>{
    try{
        // console.log("request received")
        // console.log("req.cookies:",req.cookies)
        const token=req.cookies.token;
        // console.log("token: ",token)
        if(!token){
            return res.status(400).json({message:"No token found"})
        }
        const user=await User.findOne({token:token})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        user.token=null;
        user.tokenExpiresAt=null;
        await user.save();
        res.clearCookie("token")
        res.status(200).json({message:"Logout successful"})
    }catch(err){
        return res.status(500).json({message:err.message})
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
    const token=req.cookies.token;
    if(!token){
        return res.status(400).json({message:"No token found"})
    }
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

    let outputPath =await convertUserDataTOPDF(userProfile)

    return res.json({'message':outputPath})


}

export const sendConnectionRequest=async(req,res)=>{
const {token,connectionId}=req.body;
try{
    const user=await User.findOne({token:token})
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    const connectionUser=await User.findOne({_id:connectionId})
    if(!connectionUser){
        return res.status(404).json({message:"User not found"})
    }
    const exisitngConnection=await ConnectionRequest.findOne({
        userId:user._id,
        connectionId:connectionUser._id
    })
    if(exisitngConnection){
        return res.status(400).json({message:"Connection request already sent"})
    }

    const request=new sendConnectionRequest({
        userId:user._id,
        connectionId:connectionUser._id
    })
    await request.save();
    return res.status(200).json({message:"Connection request sent"})

}catch(err){
    return res.status(500).json({message:err.message})
}
}

export const getMyConnectionRequests=async(req,res)=>{
    try{
        const {token}=req.body;
        const user=await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const connection =await sendConnectionRequest.find({connectionId:user._id})
        .populate('userId','name email username profilePicture')

        return res.json({connection})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const whatAreMyConnections=async(req,res)=>{
    try{
        const {token}=req.body;
        const user=await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const connections=await ConnectionRequest.find({connectionId:user._id})
        .populate('userId','name email username profilePicture')
        return res.json({connections})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

export const acceptConnectionRequest=async(req,res)=>{
    try{
        const {token,requestId,action_type}=req.body;
        const user=await User.findOne({token});
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const connection=await ConnectionRequest.findOne({_id:requestId})
        if(!connection){
            return res.status(404).json({message:"Connection request not found"})
        }
        action_type==="accept" ? connection.status_accepted=true : connection.status_accepted=false;
        await connection.save();
        return res.json({message:"Connection request updated"})
    }catch(err){
        return res.json({message:err.message})
    }
}

export const commentPost=async(req,res)=>{
    try{
        const {token,post_id,commentBody}=req.body;
        const user=await User.findOne({token:token})
        .select({_id});
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const post=await Post.findOne({_id:post_id});
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        const comment=new Comment({
            userId:user._id,
            postId:post_id,
            body:commentBody
        })
        await comment.save();
        return res.status(200).json({message:"Comment added"})
    
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}
export const getAllComments=async(req,res)=>{
    try{
        const {post_id}=req.body;
        const comments=await Comment.findMany({postId:post_id})
        .populate('userId','name email username profilePicture')
        return res.status(200).json({comments})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}
export const deleteComment=async(req,res)=>{
    try{
        const {token,comment_id}=req.body;
        const user=await User.findOne({token:token})
        .select({_id});
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const comment=await Comment.findOne({_id:comment_id});
        if(!comment){
            return res.status(404).json({message:"Comment not found"})
        }
        user._id.toString() !==comment.userId.toString() ? res.status(400).json({message:"You can't delete this comment"}):null;
        await Comment.deleteOne({_id:comment_id});
        return res.status(200).json({message:"Comment deleted"})
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}
export const increment_Likes=async(req,res)=>{
    try{
        const {token,post_id}=req.body;
        const user=await User.findOne({ token:token})
        .select({_id});
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const post=await Post.findOne({_id:post_id});
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        post.likes=post.likes+1;
        await post.save();
        return res.status(200).json({message:"Like added"})

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}