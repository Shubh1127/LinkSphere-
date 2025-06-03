const { createSlice } = require("@reduxjs/toolkit")

const initialState={
    posts:[],
    isError:false,
    postFetched:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    comments:[],
    postId:""
}

const postSlice=createSlice({
    name:"post",
    initialState,
    reducers:{
        reset:()=>initialState,
        resetPostId:(state,action)=>{
            state.postId=""
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllPosts.pending,(state)=>{
            state.isLoading=true
            state.message="Loading all the posts..."
        })
        .addCase(getAllPosts.fullfilled,(state,action)=>{
            state.isLoading=false
            state.isError=false
            state.postFetched=true
            state.posts=action.payload.posts
        })
        .addCase(getAllPosts.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.postFetched=false
            state.message=action.payload.message || "Failed to fetch posts"
        })
    }
})

export default postSlice.reducer;