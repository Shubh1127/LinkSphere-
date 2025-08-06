import React, { useEffect } from "react";
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
              <textarea
                className=" flex-1 outline rounded-lg h-[8vh] w-[15vw]  pt-3 ps-1"
                name=""
                id=""
                placeholder="  what's on your mind?"
              ></textarea>
              <div className="   items-center py-2 h-[7vh] w-[5vw]   ">
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

                {/* <button className="bg-blue-500 text-white rounded-lg px-2 py-1">
                  Post
                </button> */}
              </div>
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
