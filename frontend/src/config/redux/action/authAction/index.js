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
            // console.log("User data fetched successfully:", response.data);
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

export const sendConnectionRequest = createAsyncThunk(
  "auth/sendConnectionRequest",
  async (payload, thunkAPI) => {
    try {
      // payload can be { receiverId } or { connectionId }
      const res = await clientServer.post("/user/send_connection_request", payload, { withCredentials: true });
      return thunkAPI.fulfillWithValue(res.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Failed to send request" });
    }
  }
);

export const getMyConnectionRequests = createAsyncThunk(
  "auth/getMyConnectionRequests",
  async (_, thunkAPI) => {
    try {
      const res = await clientServer.post("/user/get_connection_request", {}, { withCredentials: true });
      return thunkAPI.fulfillWithValue(res.data); // { requests: [] } incoming (senderId populated)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Failed to fetch requests" });
    }
  }
);

export const getMyConnections = createAsyncThunk(
  "auth/getMyConnections",
  async (_, thunkAPI) => {
    try {
      const res = await clientServer.post("/user/user_connection_request", {}, { withCredentials: true });
      return thunkAPI.fulfillWithValue(res.data); // { connections: [] } accepted (senderId, receiverId populated)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Failed to fetch connections" });
    }
  }
);

export const acceptConnectionRequest = createAsyncThunk(
  "auth/acceptConnectionRequest",
  async ({ requestId, action_type }, thunkAPI) => {
    try {
      const res = await clientServer.post(
        "/user/accept_connection_request",
        { requestId, action_type },
        { withCredentials: true }
      );
      return thunkAPI.fulfillWithValue(res.data); // { message, request }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Failed to update request" });
    }
  }
);

export const getMySentConnectionRequests = createAsyncThunk(
  "auth/getMySentConnectionRequests",
  async (_, thunkAPI) => {
    try {
      const res = await clientServer.get("/user/my_sent_requests", { withCredentials: true });
      return thunkAPI.fulfillWithValue(res.data); // { requests: [] } outgoing (receiverId populated)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Failed to fetch sent requests" });
    }
  }
);