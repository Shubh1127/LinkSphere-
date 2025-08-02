const { createSlice } = require("@reduxjs/toolkit")
import { getAboutUser, loginUser, registerUser } from "../../action/authAction/index"

const initialState ={
    user:[],
    isError:false,
    isSuccess:false,
    isLoading:false,
    message:"",   
    loggedIn:false,
    connections:[],
    connectionRequest:[],      
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset:()=> initialState,
        handleLoginUser:(state)=>{
            state.message="hello"
        },
        emptyMessage:(state)=>{
            state.message="";
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.isLoading=true
            state.message="loading"
        })

        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isError=false
            state.loggedIn=true
            state.isSuccess=true
            state.user=action.payload
            state.message="login successful"
        })

        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.isSuccess=false
            state.message=action.payload
        })

        .addCase(registerUser.pending,(state)=>{
            state.isLoading=true
            state.message="Registering user"
        })

        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading==false,
            state.isError=false
            state.isSuccess=true,
            state.loggedIn=true
            state.message="Registration successful"
            state.user=action.payload
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.isSuccess=false
            state.message=action.payload
        })
        .addCase(getAboutUser.pending,(state)=>{
            state.isLoading=true
            state.message="Fetching user data"
        })
        .addCase(getAboutUser.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isError=false
            state.isSuccess=true
            state.user=action.payload.profile
            state.message="User data fetched successfully"
        })
        .addCase(getAboutUser.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.isSuccess=false
            state.message=action.payload.message || "Failed to fetch user data"
        })
    }
})

export const {reset,emptyMessage}=authSlice.actions
export default authSlice.reducer