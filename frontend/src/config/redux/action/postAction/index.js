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
