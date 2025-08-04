import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser=createAsyncThunk(
    "user/login",
    async (user,thunkAPI)=>{
        try{
            const response=await clientServer.post("/login",{
                identifier:user.identifier,
                password:user.password,
            })
                        return thunkAPI.fulfillWithValue(response.data.message);

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data)

        }
    }
)
export const registerUser=createAsyncThunk(
    "user/register",
    async (user,thunkAPI)=>{
        try{
            const response=await clientServer.post("/register",{
                username:user.username,
                name:user.name,
                email:user.email,
                password:user.password,
            })
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const getAboutUser=createAsyncThunk(
    "user/getAboutUser",
    async (_,thunkAPI)=>{
        try{
            const response=await clientServer.get(`/get_user_and_profile`)
            console.log("User data fetched successfully:", response.data);
            return thunkAPI.fulfillWithValue(response.data)
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const logoutUser=createAsyncThunk(
    "user/logout",
    async (_,thunkAPI)=>{
        try{
            await clientServer.post("/logout")
            
            return thunkAPI.fulfillWithValue("User logged out successfully");
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const getAllUsers=createAsyncThunk(
    "user/getAllUsers",
    async (_,thunkAPI)=>{
        try{
            const response=await clientServer.get("user/get_all_users")
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)