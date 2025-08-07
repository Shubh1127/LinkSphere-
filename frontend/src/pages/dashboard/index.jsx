import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAboutUser,
  getAllUsers,
  logoutUser,
} from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import { getAllPosts } from "@/config/redux/action/postAction";
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

    const [postContent,setPostContent]=useState("");
    const [fileContent,setFileContent]=useState();

    const handlePostSubmit=async ()=>{
      console.log("Post content:", postContent);
      setPostContent("");
    }
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
          <div className="scrollComponent">
            <div className="createPostContainer flex bg-pink-50 rounded-xl  p-4 gap-4  ">
              <img
                width={60}
                className="rounded-full"
                src={`${BASE_URL}/${authState.user?.userId?.profilePicture}`}
                alt="Profile"
              />
              <div className="outline w-[80%] rounded-lg h-max flex">
                <textarea
                  onChange={(e)=>setPostContent(e.target.value)}
                  value={postContent}
                  className=" flex-1  rounded-lg h-[8vh] w-[15vw]  pt-3 ps-1 focus:outline-none resize-none"
                  name=""
                  id=""
                  placeholder="  what's on your mind?"
                ></textarea>
                  <label htmlFor="fileUpload" className="cursor-pointer">
                <div className="  items-center py-2 h-[7vh] w-[5vw]   ">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-11 ms-2 border rounded-full cursor-pointer mb-1 bg-blue-800 text-white hover:bg-blue-700 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                    <input type="file" accept="image/*" onChange={(e) => setFileContent(e.target.files[0])} className="hidden" id="fileUpload" />
                </div>
                </label>
                   
                  
              </div>
              <button className="bg-blue-500 text-white mt-2 cursor-pointer rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 ease-in-out">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                  onClick={handlePostSubmit}
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
