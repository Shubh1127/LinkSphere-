import React, { useEffect, useState } from "react";
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
  console.log("Auth State:", authState);
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

  console.log("postState.....", postState);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [deletePostId, setDeletePostId] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentBoxId, setCommentBoxId] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [deleteCommentId, setDeleteCommentId] = useState(null);

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
  const handleLikes = async (postId) => {
    console.log("Post ID for likes:", postId);
    await dispatch(increment_Likes(postId));
    dispatch(getAllPosts());
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };
  useEffect(() => {
    if (authState.isTokenThere) {
      console.log("Token received in dashboard:", token);
      dispatch(getAllPosts());
      dispatch(getAboutUser());
      // dispatch(getAllComments({ postId: post._id }));
    }
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere, dispatch]);

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
              {postState.isLoading ? (
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
                    <div className="flex flex-col  gap-2 px-2 py-1">
                      <hr />
                      <div className="flex justify-evenly">
                        <div className="flex items-center gap-1 cursor-pointer">
                          {post.likedBy &&
                          post.likedBy.includes(authState.user.userId) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-6 text-blue-600 animate-bounce"
                              onClick={() => handleLikes(post._id)}
                            >
                              <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6 transition-all duration-300"
                              onClick={() => handleLikes(post._id)}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                              />
                            </svg>
                          )}
                          <div
                            onClick={() => handleLikes(post._id)}
                            className="flex items-center "
                          >
                            {post.likes}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer">
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
                      {commentBoxId === post._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 border rounded-lg px-2 py-1"
                            onChange={(e) => setCommentBoxId(e.target.value)}
                          />
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                            onClick={() => {
                              dispatch(
                                CommentPost({
                                  postId: post._id,
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
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 border rounded-lg px-2 py-1"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                          />
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                            onClick={() => {
                              dispatch(
                                CommentPost({
                                  postId: post._id,
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
                      )}
                    </div>
                    <div>
                      {post.comments.length > 0 && (
                        <>
                          <h2 className="text-lg font-semibold mx-1 my-1">
                            Comments
                          </h2>
                          <div className="mt-2">
                            {post.comments.map((comment) => (
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
                                      onClick={() => setDeleteCommentId(deleteCommentId=== comment._id? null :comment._id)}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                      />
                                    </svg>
                                    {deleteCommentId && (
                                      <div className="absolute bg-gray-300 px-1 py-1 rounded-md text-red-400 flex cursor-pointer hover:text-red-500 ">
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
                                        <p>
                                        delete comment
                                        </p>
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
