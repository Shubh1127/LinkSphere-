import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser=createAsyncThunk(
    "user/login",
    async (user,thunkAPI)=>{
        try{
            const response=await clientServer.post("/login",{
                email:user.email,
                password:user.password,
            })
                        return thunkAPI.fulfillWithValue(response.data.token)


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