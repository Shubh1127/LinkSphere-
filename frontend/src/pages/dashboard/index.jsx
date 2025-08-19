import React, { useEffect, useState, useRef } from "react";
import styles from "./st.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import {
  createPost,
  deletePost,
  getAllPosts,
  increment_Likes,
  CommentPost,
  getCommentsByPostId,
  getAllComments,
  deleteComment, // filepath import added
} from "@/config/redux/action/postAction";
import UserLayout from "@/layout/UserLayout/UserPage";
import DashboardLayout from "@/layout/DashboardLayout";
import { BASE_URL } from "@/config";
import { comment } from "postcss";
// import { setTokenIsThere } from "@/config/redux/reducer/authReducer";
export async function getServerSideProps({ req }) {
  const token = req.cookies?.token;
  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { token } };
}

const Dashboard = ({ token }) => {
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const [isTokenThere, setTokenIsThere] = React.useState(false);
  // console.log("Auth State:", authState);
  const dispatch = useDispatch();
  const router = useRouter();
  // const handleLogout = () => {
  //   dispatch(logoutUser());
  //   router.push("/");
  // };
  // console.log("authState user---?",authState.user.profile?.userId?.profilePicture)
  useEffect(() => {
    if (token) {
      setTokenIsThere(true);
    }
  }, [token]);

  // console.log("postState.....", postState);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [deletePostId, setDeletePostId] = useState(null);
  const [commentBoxId, setCommentBoxId] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [popupPost, setPopupPost] = useState(null);

  const handlePostSubmit = async () => {
    console.log("Post content:", postContent);
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent("");
    dispatch(getAllPosts());
  };
  const handleDeletePost = (postId) => {
    console.log("Delete post ID:", postId);
    dispatch(deletePost(postId));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileContent(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };
  const handleLikes = (postId) => {
    dispatch(increment_Likes(postId)); // do not refetch posts
  };

  useEffect(() => {
    if (authState.isTokenThere) {
      // console.log("Token received in dashboard:", token);
      dispatch(getAllPosts());
      dispatch(getAboutUser());
      // dispatch(getAllComments({ postId: post._id }));
    }
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere, dispatch]);

  useEffect(() => {
    if (popupPost) {
      const updated = postState.posts.find((p) => p._id === popupPost._id);
      if (updated) setPopupPost(updated);
    }
  }, [postState.posts, popupPost]);

  useEffect(() => {
    if (popupPost) {
      const scrollBarComp = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollBarComp) document.body.style.paddingRight = `${scrollBarComp}px`; // avoid layout shift
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [popupPost]);

  if (authState.user.length !== 0) {
    return (
      <UserLayout token={token}>
        <DashboardLayout token={token}>
          <div className="scrollComponent  flex flex-col justify-center items-center">
            <div className="createPostContainer flex w-[80%]  bg-pink-50 rounded-xl  p-4 gap-4   ">
              <img
                width={60}
                className="rounded-full h-fit"
                src={`${BASE_URL}/${authState.user?.userId?.profilePicture}`}
                alt="Profile"
              />
              <div className=" flex flex-col flex-1   ">
                <div>
                  {previewUrl && (
                    <div className="relative inline-block">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mt-2 rounded-lg max-h-40"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setFileContent(null);
                        }}
                        className="absolute top-3 right-1 bg-white rounded-full p-1 shadow hover:bg-red-100 cursor-pointer"
                        aria-label="Remove image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 text-red-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ">
                  <div className="outline flex-1 rounded-lg h-max flex items-center gap-2">
                    <textarea
                      onChange={(e) => setPostContent(e.target.value)}
                      value={postContent}
                      className="flex-1 rounded-lg h-[8vh] w-[15vw] pt-3 ps-1 focus:outline-none resize-none"
                      name=""
                      id=""
                      placeholder="what's on your mind?"
                    ></textarea>
                    <label htmlFor="fileUpload" className="cursor-pointer">
                      <div className="items-center py-2 h-[7vh] w-[5vw]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-11 ms-2 border rounded-full cursor-pointer mb-1 bg-blue-800 text-white hover:bg-blue-700"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="fileUpload"
                        />
                      </div>
                    </label>
                  </div>
                  <button
                    onClick={handlePostSubmit}
                    className="bg-blue-500  text-white mt-2 cursor-pointer rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 ease-in-out"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="postContainer w-[60%] my-2 flex flex-col ">
              {postState.isLoadingPosts ? (
                <div className="flex justify-center items-center h-64">
                  <h1 className="text-gray-500">Loading...</h1>
                </div>
              ) : postState.posts.length > 0 ? (
                postState.posts.map((post) => (
                  <div key={post._id} className="postCard outline my-2">
                    <div className="flex   gap-2  m-1">
                      <div>
                        <img
                          src={`${BASE_URL}/${post.userId.profilePicture}`}
                          alt="Profile"
                          className="w-17 h-17"
                        />
                      </div>
                      <div className="flex flex-col  flex-1">
                        <p className="font-bold">{post.userId.username}</p>
                        <p className="text-md text-gray-500">
                          {post.userId.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(() => {
                            const createdDate = new Date(post.createdAt);
                            const now = new Date();
                            const diffMs = now - createdDate;
                            const diffHours = Math.floor(
                              diffMs / (1000 * 60 * 60)
                            );
                            if (diffHours < 24) {
                              return `${diffHours}h ago`;
                            } else {
                              const diffDays = Math.floor(diffHours / 24);
                              return `${diffDays} day${
                                diffDays !== 1 ? "s" : ""
                              } ago`;
                            }
                          })()}
                        </p>
                      </div>
                      {post.userId._id === authState?.user?.userId?._id && (
                        <div className=" flex w-max relative ellipse-symbol   justify-end">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-6 cursor-pointer relative"
                            onClick={() =>
                              setDeletePostId(
                                deletePostId === post._id ? null : post._id
                              )
                            }
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {deletePostId === post._id && (
                            <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg p-2 w-max">
                              <button
                                onClick={() => {
                                  handleDeletePost(post._id);
                                  console.log("Delete post:", post._id);
                                  setDeletePostId(null);
                                }}
                                className="text-red-500 hover:text-red-700 flex cursor-pointer"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="size-6"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <p>Delete Post</p>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="px-2 py-1">{post.body}</p>
                    </div>
                    <div>
                      {post.media && (
                        <img
                          src={`${BASE_URL}/${post.media}`}
                          alt="Post media"
                          className="w-full h-auto "
                        />
                      )}
                    </div>
                    <div className="flex flex-col  gap-1 px-2 py-1">
                      <hr />
                      <div className="flex justify-evenly">
                        <div className="flex items-center gap-1 cursor-pointer">
                          <span
                            className={`flex items-center gap-1 ${
                              postState.likeLoadingByPostId[post._id]
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }`}
                            onClick={() => handleLikes(post._id)}
                            title="Like"
                          >
                            {(() => {
                              const userId = authState.user?.userId?._id;
                              const liked =
                                Array.isArray(post.likedBy) &&
                                post.likedBy.some(
                                  (id) => String(id) === String(userId)
                                );
                              return (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className={`size-6 ${
                                      liked ? "text-red-600" : "text-gray-600"
                                    }`}
                                    fill={liked ? "currentColor" : "none"}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                    />
                                  </svg>
                                  <span>{post.likes}</span>
                                </>
                              );
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                            onClick={() => {
                              setPopupPost(post);
                              dispatch(getCommentsByPostId(post._id));
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                            />
                          </svg>
                          <div>{post.comments.length}</div>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      {/* comments in the bottom of the post */}
                      {post.comments.length > 0 && (
                        <>
                          <h2 className="text-lg font-semibold mx-1 px-1 my-1">
                            Comments
                          </h2>
                          <div className="mt-2">
                            {post.comments.slice(-2).map((comment) => (
                              <div
                                key={comment._id}
                                className="border-b py-2 flex gap-1 justify-between items-center mx-2"
                              >
                                <div className="flex items-center gap-1">
                                  <img
                                    src={`${BASE_URL}/${comment.userId.profilePicture}`}
                                    alt={comment.userId.username}
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <p className="font-semibold">
                                    {comment.userId.username} :
                                  </p>
                                  <p>{comment.body}</p>
                                </div>
                                {comment.userId._id ===
                                  authState.user.userId._id && (
                                  <div>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="size-6 text-gray-400 hover:text-gray-600 cursor-pointer relative"
                                      onClick={() =>
                                        setDeleteCommentId(
                                          deleteCommentId === comment._id
                                            ? null
                                            : comment._id
                                        )
                                      }
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                      />
                                    </svg>
                                    {deleteCommentId === comment._id && (
                                      <div
                                        className="absolute bg-gray-300 px-1 py-1 rounded-md text-red-400 flex cursor-pointer hover:text-red-500 "
                                        onClick={() => {
                                          dispatch(deleteComment(comment._id));
                                          setDeleteCommentId(null);
                                        }}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="size-6"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                          />
                                        </svg>
                                        <p>delete comment</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-64">
                  <h1 className="text-gray-500">No posts available</h1>
                </div>
              )}
            </div>
            {popupPost && (
              <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-60">
                <div className="bg-white rounded-lg shadow-lg flex w-[70vw] h-[70vh] relative ">
                  {/* Close Button */}
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
                    onClick={() => setPopupPost(null)}
                  >
                    &times;
                  </button>
                  {/* Left: Post */}
                  <div className="w-1/2  border-r  ">
                    {popupPost.media ? (
                      <img
                        src={`${BASE_URL}/${popupPost.media}`}
                        alt="Post media "
                        className="w-full h-full "
                      />
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-gray-500">No media available</p>
                      </div>
                    )}
                  </div>
                  {/* Right: CommentsDash */}
                  <div className="w-1/2 px-2   flex flex-col h-full">
                    <div className="flex gap-2 mb-2 border-b py-1 ">
                      <div className="flex ">
                        <img
                          src={`${BASE_URL}/${popupPost.userId.profilePicture}`}
                          alt="Profile"
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div className="">
                        <p className="font-bold">{popupPost.userId.username}</p>
                        {/* <p className="text-gray-500">{popupPost.userId.name}</p> */}
                      </div>
                    </div>
                    {/*post body*/}
                    <div className="flex  mb-2  py-1 ">
                      <div className="flex w-10 h-10 ">
                        <img
                          src={`${BASE_URL}/${popupPost.userId.profilePicture}`}
                          alt="Profile"
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <div className="  w-full h-max ">
                        <p className="mb-2 px-3">
                          <span className="font-bold">
                            {popupPost.userId.username}
                          </span>
                          &nbsp;{popupPost.body}{" "}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col  justify-between  h-full ">
                      <div className="flex-1  overflow-y-auto max-h-[38vh]">
                        {(() => {
                          const list =
                            postState.commentsByPostId[popupPost._id] ??
                            popupPost.comments ??
                            [];
                          return list.length > 0 ? (
                            list.map((comment) => (
                              <div
                                key={comment._id}
                                className="py-2 flex justify-between items-center gap-2 relative"
                              >
                                <div className="flex items-center gap-2">
                                  <img
                                    src={`${BASE_URL}/${comment.userId.profilePicture}`}
                                    alt={comment.userId.username}
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <p>
                                    <span className="font-semibold">
                                      {comment.userId.username}
                                    </span>
                                    &nbsp;<span>{comment.body}</span>
                                  </p>
                                </div>

                                {comment.userId._id ===
                                  authState.user.userId._id && (
                                  <div className="relative">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="size-6 text-gray-400 hover:text-gray-600 cursor-pointer"
                                      onClick={() =>
                                        setDeleteCommentId(
                                          deleteCommentId === comment._id
                                            ? null
                                            : comment._id
                                        )
                                      }
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                      />
                                    </svg>

                                    {deleteCommentId === comment._id && (
                                      <div
                                        className="absolute right-0 top-7 w-max bg-white border rounded-md shadow px-1 py-1 text-red-500 hover:bg-gray-100 cursor-pointer z-10 flex items-center gap-1"
                                        onClick={() => {
                                          dispatch(
                                            deleteComment(comment._id)
                                          ).then(() => {
                                            // Ensure popup list updates; this does NOT refresh the feed
                                            dispatch(
                                              getCommentsByPostId(popupPost._id)
                                            );
                                          });
                                          setDeleteCommentId(null);
                                        }}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="size-5"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                          />
                                        </svg>
                                        <span className="text-sm">Delete comment</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center">
                              No comments yet.
                            </p>
                          );
                        })()}
                        {/* Add comment input here if needed */}
                      </div>
                      <div className="border-t pt-1  flex flex-col gap-3">
                        <div className="flex gap-4 ">
                          <span
                            className={`flex flex-col items-center cursor-pointer ${
                              postState.likeLoadingByPostId[popupPost._id]
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }`}
                            onClick={() => {
                              const uid = authState.user?.userId?._id;
                              // optimistic UI update
                              setPopupPost((prev) => {
                                if (!prev) return prev;
                                const already =
                                  Array.isArray(prev.likedBy) &&
                                  prev.likedBy.some(
                                    (id) => String(id) === String(uid)
                                  );
                                const nextLikedBy = already
                                  ? prev.likedBy.filter(
                                      (id) => String(id) !== String(uid)
                                    )
                                  : [...(prev.likedBy || []), uid];
                                const nextLikes = already
                                  ? Math.max(0, (prev.likes || 0) - 1)
                                  : (prev.likes || 0) + 1;
                                return {
                                  ...prev,
                                  likedBy: nextLikedBy,
                                  likes: nextLikes,
                                };
                              });
                              handleLikes(popupPost._id); // will update Redux; your sync useEffect will reconcile
                            }}
                            title="Like"
                          >
                            {(() => {
                              const uid = authState.user?.userId?._id;
                              const liked =
                                Array.isArray(popupPost.likedBy) &&
                                popupPost.likedBy.some(
                                  (id) => String(id) === String(uid)
                                );
                              return (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill={liked ? "currentColor" : "none"}
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className={`size-6 ${
                                    liked ? "text-red-600" : ""
                                  }`}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                  />
                                </svg>
                              );
                            })()}
                          </span>
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                              />
                            </svg>
                            {/* {popupPost.comments.length} */}
                          </span>
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                              />
                            </svg>
                          </span>
                        </div>
                        <div className="flex flex-col ">
                          <div className="text-lg ps-1">
                            <p>
                              {popupPost.likes} Like
                              {popupPost.likes !== 1 && "s"}
                            </p>
                          </div>
                          <div className="text-gray-500 text-sm ps-1">
                            {(() => {
                              const createdAt = new Date(popupPost.createdAt);
                              const now = new Date();
                              const diffMs = now - createdAt;

                              const diffMinutes = Math.floor(
                                diffMs / (1000 * 60)
                              );
                              const diffHours = Math.floor(
                                diffMs / (1000 * 60 * 60)
                              );
                              const diffDays = Math.floor(
                                diffMs / (1000 * 60 * 60 * 24)
                              );

                              if (diffDays >= 1) {
                                return `${diffDays} day${
                                  diffDays > 1 ? "s" : ""
                                } ago`;
                              } else if (diffHours >= 1) {
                                return `${diffHours} hour${
                                  diffHours > 1 ? "s" : ""
                                } ago`;
                              } else {
                                return `${diffMinutes} minute${
                                  diffMinutes !== 1 ? "s" : ""
                                } ago`;
                              }
                            })()}
                          </div>
                          <div className="">
                            {commentBoxId === popupPost._id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Add a comment..."
                                  className="flex-1  px-2 py-1"
                                  value={commentInput}
                                  onChange={(e) =>
                                    setCommentInput(e.target.value)
                                  }
                                />
                                <button
                                  className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                                  onClick={() => {
                                    dispatch(
                                      CommentPost({
                                        postId: popupPost._id,
                                        comment: commentInput,
                                      })
                                    );
                                    setCommentInput("");
                                    setCommentBoxId(null);
                                  }}
                                >
                                  Post
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center  gap-2">
                                <input
                                  type="text"
                                  placeholder="Add a comment..."
                                  className="flex-1 px-2 py-2 outline-none "
                                  value={commentInput}
                                  onChange={(e) =>
                                    setCommentInput(e.target.value)
                                  }
                                />
                                <button
                                  className=" text-black cursor-pointer px-3 py-1 rounded-lg"
                                  onClick={() => {
                                    if (!commentInput.trim()) return;
                                    dispatch(
                                      CommentPost({
                                        postId: popupPost._id,
                                        comment: commentInput.trim(),
                                      })
                                    ).then(() =>
                                      dispatch(
                                        getCommentsByPostId(popupPost._id)
                                      )
                                    ); // refresh only this list
                                    setCommentInput("");
                                  }}
                                >
                                  Post
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  } else {
    return (
      <UserLayout token={token}>
        <DashboardLayout token={token}>
          <div className="scrollComponent">
            <div className="createPostContainer">
              <h1>Loading...</h1>
            </div>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  }
};

export default Dashboard;
