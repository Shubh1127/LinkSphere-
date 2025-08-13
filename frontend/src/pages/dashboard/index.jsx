import React, { useEffect, useState } from "react";
import styles from "./st.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAboutUser,
  getAllUsers,
  logoutUser,
} from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import { createPost, getAllPosts } from "@/config/redux/action/postAction";
import UserLayout from "@/layout/UserLayout/UserPage";
import DashboardLayout from "@/layout/DashboardLayout";
import { BASE_URL } from "@/config";
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

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const [previewUrl, setPreviewUrl] = useState(null);

  const handlePostSubmit = async () => {
    console.log("Post content:", postContent);
    dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent("");
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
  useEffect(() => {
    if (authState.isTokenThere) {
      console.log("Token received in dashboard:", token);
      dispatch(getAllPosts());
      dispatch(getAboutUser());
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
                      <div
                        className="flex flex-col  flex-1"
                      >
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
                      <div className=" flex w-max relative   justify-end">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
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
                      <div className="flex items-center ">{post.likes}</div>
                      <hr />
                      <div className="flex justify-evenly">
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
                            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
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
                            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
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
