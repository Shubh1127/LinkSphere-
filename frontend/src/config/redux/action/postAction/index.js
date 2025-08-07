import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts=createAsyncThunk(
    "post/getAllPosts",
    async(_,thunkAPI)=>{
        try{
            const response=await clientServer.get("/posts")
            console.log("Is browser:", typeof window !== "undefined");
            console.log("Posts fetched successfully:", response.data);
            return thunkAPI.fulfillWithValue(response.data)
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)


export const createPost=createAsyncThunk(
    "post/createPost",
    async(userData,thunkAPI)=>{
        try{
            const {file,body}=userData;
            const formData=new FormData();
            formData.append('body',body);
            formData.append('media',file)
            const response=await clientServer.post("/post",formData,{
                headers:{
                    'Content-Type':'Multipart/form-data'
                }
            })

            if(response.status===200){
                return thunkAPI.fulfillWithValue("Post Uploaded successfully")
            }else{
                return thunkAPI.rejectWithValue("Failed to upload post")
            }
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)