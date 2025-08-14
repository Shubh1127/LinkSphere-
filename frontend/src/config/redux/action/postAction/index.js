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

export const deletePost=createAsyncThunk(
    "post/deletePost",
    async(postId,thunkAPI)=>{
        try{
            const response=await clientServer.delete('delete_post',{
                data: { post_id: postId }
            });
            if(response.status===200){
                return thunkAPI.fulfillWithValue("Post deleted successfully");
            }else{
                return thunkAPI.rejectWithValue("Failed to delete post");
            }

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)
export const increment_Likes=createAsyncThunk(
    "post/increment_Likes",
    async (postId,thunkAPI)=>{
        try{
            const response=await clientServer.post("/like",{
                post_id:postId
            });
            if(response.status===200){
                return thunkAPI.fulfillWithValue({ postId, likes: response.data.likes, likedBy: response.data.likedBy });
            }else{
                return thunkAPI.rejectWithValue("Failed to like post");
            }
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)
export const CommentPost = createAsyncThunk(
  "post/CommentPost",
  async ({ postId, comment }, thunkAPI) => {
    try {
      const response = await clientServer.post("/comment", {
        post_id: postId,
        comment: comment
      });
      if (response.status === 200) {
        return thunkAPI.fulfillWithValue({
          postId,
          comment: response.data.comment // assuming backend returns the new comment
        });
      } else {
        return thunkAPI.rejectWithValue("Failed to add comment");
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
)

export const getAllComments=createAsyncThunk(
    "post/getAllComments",
    async(postId,thunkAPI)=>{
        try{
            const response=await clientServer.get("/comments",{
                params: { post_id: postId }
            });
            if(response.status===200){
                return thunkAPI.fulfillWithValue(response.data);
            }else{
                return thunkAPI.rejectWithValue("Failed to fetch comments");
            }

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const getCommentsByPostId=createAsyncThunk(
    "post/getCommentsByPostId",
    async (postId,thunkAPI)=>{
        try{
            const response=await clientServer.get("/comments",{
                params: { post_id: postId }
            });
            if(response.status===200){
                return thunkAPI.fulfillWithValue(response.data);
            }else{
                return thunkAPI.rejectWithValue("Failed to fetch comments");
            }

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)
export const deleteComment =createAsyncThunk(
    "post/deleteComment",
    async (commentId,thunkAPI)=>{
        try{
            

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)