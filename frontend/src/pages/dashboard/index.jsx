import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser, logoutUser } from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import { getAllPosts } from "@/config/redux/action/postAction";
import UserLayout from "@/layout/UserLayout/UserPage";
import DashboardLayout from "@/layout/DashboardLayout";
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
  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
  };

  useEffect(()=>{
    if(token){
      setisTokenThere(true);
    }
  },[token])

  useEffect(() => {
    if (isTokenThere) {
      console.log("Token received in dashboard:", token);
      dispatch(getAllPosts());
      dispatch(getAboutUser());
    }
  }, [authState.isTokenThere, dispatch]);
  return (
    // <UserLayout className="transition-opacity duration-500 opacity-100" token={token}>
    //   <div className="flex items-baseline justify-between m-4">
    //     <p>Dashboard</p>
    //     {/* <button
    //       className="me-2 border rounded-xl p-1 px-2 hover:bg-gray-100 cursor-pointer"
    //       onClick={handleLogout}
    //     >
    //       Logout
    //     </button> */}
    //   </div>
    //   <div>
    //     {authState.user && (
    //       <div className="flex items-center gap-4">
    //         {/* <img
    //           src={authState.user.userId.profilePicture}
    //           alt="Profile"
    //           className="w-16 h-16 rounded-full"
    //         /> */}
    //         <div>
    //           <p className="text-lg font-bold">{authState?.user?.userId?.name}</p>
    //           <p className="text-sm text-gray-500">
    //             {/* {authState.user.userId.email} */}
    //           </p>
    //         </div>
    //       </div>
    //     )}{" "}
    //     {/* Display user information */}
    //   </div>
    // </UserLayout>
    <UserLayout token={token}>
     <DashboardLayout>
      <div>
        <h1>Dashboard</h1>
      </div>
     </DashboardLayout>
    </UserLayout>
  );
};

export default Dashboard;
