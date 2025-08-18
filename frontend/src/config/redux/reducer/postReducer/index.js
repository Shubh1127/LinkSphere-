import {
  CommentPost,
  deletePost,
  getAllPosts,
  increment_Likes,
  getAllComments,
  getCommentsByPostId,
  deleteComment,
} from "../../action/postAction";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false, // keep if you use it elsewhere
  isLoadingPosts: false, // used by the feed loader in the component
  loggedIn: false,
  message: "",
  comments: [],
  commentsByPostId: {},
  commentLoadingByPostId: {}, // FIX: ensure this exists
  postId: "",
  likeLoadingByPostId: {}, // NEW
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state, action) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoadingPosts = true; // use isLoadingPosts for the feed
        state.message = "Loading all the posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoadingPosts = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload.posts.reverse();
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoadingPosts = false;
        state.isError = true;
        state.postFetched = false;
        state.message = action.payload.message || "Failed to fetch posts";
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.message = "Deleting post...";
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload;
        state.posts = state.posts.filter(
          (post) => post._id !== action.meta.arg
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "Failed to delete post";
      })
      .addCase(increment_Likes.pending, (state, action) => {
        const pid = action.meta?.arg;
        if (pid) state.likeLoadingByPostId[pid] = true;
      })
      .addCase(increment_Likes.fulfilled, (state, action) => {
        const pid = action.meta.arg;
        if (pid) state.likeLoadingByPostId[pid] = false;

        const { likes, likedBy } = action.payload || {};
        const i = state.posts.findIndex((p) => p._id === pid);
        if (i !== -1) {
          if (typeof likes === "number") state.posts[i].likes = likes;
          if (Array.isArray(likedBy)) state.posts[i].likedBy = likedBy;
        }
      })
      .addCase(increment_Likes.rejected, (state, action) => {
        const pid = action.meta?.arg;
        if (pid) state.likeLoadingByPostId[pid] = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to like post";
      })
      .addCase(CommentPost.pending, (state, action) => {
        const pid = action.meta?.arg?.postId;
        if (!state.commentLoadingByPostId) state.commentLoadingByPostId = {}; // guard
        if (pid) state.commentLoadingByPostId[pid] = true;
      })
      .addCase(CommentPost.fulfilled, (state, action) => {
        const { postId, comment } = action.payload || {};
        if (!state.commentLoadingByPostId) state.commentLoadingByPostId = {}; // guard
        if (postId) state.commentLoadingByPostId[postId] = false;

        if (!postId || !comment) return;
        const idx = state.posts.findIndex((p) => p._id === postId);
        if (idx !== -1) {
          if (!Array.isArray(state.posts[idx].comments))
            state.posts[idx].comments = [];
          state.posts[idx].comments.push(comment);
        }
        if (state.commentsByPostId[postId]) {
          state.commentsByPostId[postId] = [
            ...state.commentsByPostId[postId],
            comment,
          ];
        }
        state.message = "Comment added";
      })
      .addCase(CommentPost.rejected, (state, action) => {
        const pid = action.meta?.arg?.postId;
        if (!state.commentLoadingByPostId) state.commentLoadingByPostId = {}; // guard
        if (pid) state.commentLoadingByPostId[pid] = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to add comment";
      })
      .addCase(getAllComments.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching comments...";
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.comments = action.payload.comments; // Assuming action.payload contains the comments array
      })
      .addCase(getAllComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "Failed to fetch comments";
      })
      .addCase(getCommentsByPostId.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching comments for post...";
      })
      .addCase(getCommentsByPostId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const { postId, comments } = action.payload;
        state.commentsByPostId[postId] = comments;
      })
      .addCase(getCommentsByPostId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message || "Failed to fetch comments";
      })
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
        state.message = "Deleting comment...";
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload || {};
        const idToRemove = commentId ?? action.meta.arg;

        if (postId) {
          const idx = state.posts.findIndex((p) => p._id === postId);
          if (idx !== -1 && Array.isArray(state.posts[idx].comments)) {
            state.posts[idx].comments = state.posts[idx].comments.filter(
              (c) => (c?._id || c) !== idToRemove
            );
          }
          if (state.commentsByPostId[postId]) {
            state.commentsByPostId[postId] = state.commentsByPostId[
              postId
            ].filter((c) => (c?._id || c) !== idToRemove);
          }
        } else {
          for (const p of state.posts) {
            if (!Array.isArray(p.comments)) continue;
            const before = p.comments.length;
            p.comments = p.comments.filter((c) => (c?._id || c) !== idToRemove);
            if (p.comments.length !== before) break;
          }
        }
        state.message = action.payload?.message || "Comment deleted";
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to delete comment";
      });
  },
});

export default postSlice.reducer;
