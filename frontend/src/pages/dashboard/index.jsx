import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser, getAllUsers, logoutUser } from "@/config/redux/action/authAction";
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
  useEffect(()=>{
    if(token){
      setTokenIsThere(true);
    }
  },[token])

  useEffect(() => {
    if (authState.isTokenThere) {
      console.log("Token received in dashboard:", token);
      dispatch(getAllPosts());
      dispatch(getAboutUser());
    }
    if(!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere, dispatch]);

  
  if(authState.user.length!==0){
    return(
    <UserLayout token={token}>
     <DashboardLayout token={token}>
      <div className="scrollComponent">
        <div className="createPostContainer">
         
              <img width={100} src={`${BASE_URL}/${authState.user?.userId?.profilePicture}`} alt="Profile" />

        </div>
      </div>
     </DashboardLayout>
    </UserLayout>)
    }
    else{
    return(
    <UserLayout token={token}>
     <DashboardLayout token={token}>
      <div className="scrollComponent">
        <div className="createPostContainer">
         <h1>Loading...</h1>
        </div>
      </div>
     </DashboardLayout>
    </UserLayout>
    )
    }
  
}

export default Dashboard;
