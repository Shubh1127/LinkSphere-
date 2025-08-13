import { CommentPost, deletePost, getAllPosts, increment_Likes ,getAllComments} from "../../action/postAction"

const { createSlice } = require("@reduxjs/toolkit")

const initialState={
    posts:[],
    isError:false,
    postFetched:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    comments:[],
    postId:"",
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
        .addCase(getAllPosts.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isError=false
            state.postFetched=true
            state.posts=action.payload.posts.reverse()
        })
        .addCase(getAllPosts.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.postFetched=false
            state.message=action.payload.message || "Failed to fetch posts"
        })
        .addCase(deletePost.pending,(state)=>{
            state.isLoading=true
            state.message="Deleting post..."
        })
        .addCase(deletePost.fulfilled,(state,action)=>{ 
            state.isLoading=false
            state.isError=false
            state.message=action.payload
            state.posts=state.posts.filter(post => post._id !== action.meta.arg);
        })
        .addCase(deletePost.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload.message || "Failed to delete post"
        })
        .addCase(increment_Likes.pending,(state)=>{
            state.isLoading=true
            state.message="Liking post..."
        })
        .addCase(increment_Likes.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isError=false
            state.message=action.payload
            const postIndex = state.posts.findIndex(post => post._id === action.meta.arg);
            if (postIndex !== -1) {
                state.posts[postIndex].likes += 1; // Increment likes count
            }
        })
        .addCase(increment_Likes.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload.message || "Failed to like post"
        })
        .addCase(CommentPost.pending,(state)=>{
            state.isLoading=true
            state.message="Commenting on post..."
        })
        .addCase(CommentPost.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isError=false
            state.message=action.payload
            const postIndex = state.posts.findIndex(post => post._id === action.meta.arg.postId);
            if (postIndex !== -1) {
                state.posts[postIndex].comments.push(action.meta.arg.comment); // Add comment to the post
            }
        })
        .addCase(CommentPost.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload.message || "Failed to comment on post"
        })
        .addCase(getAllComments.pending,(state)=>{
            state.isLoading=true
            state.message="Fetching comments..."
        })  
        .addCase(getAllComments.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isError=false
            state.comments=action.payload.comments; // Assuming action.payload contains the comments array
        })
        .addCase(getAllComments.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload.message || "Failed to fetch comments"
        })
    }
})

export default postSlice.reducer;