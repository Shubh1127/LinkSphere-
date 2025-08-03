import React from "react";
import { useRouter } from "next/router";
import { useDispatch,useSelector } from "react-redux";
import { logoutUser } from "@/config/redux/action/authAction";

const NavbarComponent = ({ token }) => {
  const authState=useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  const handleLogout=()=>{
    dispatch(logoutUser());
    router.push("/");
  }
  console.log("Token in NavbarPage:", token);
  const router = useRouter();
  return (
    <div className="flex items-baseline justify-between m-4">
      <div
        className="font-bold text-2xl ps-12 cursor-pointer"
        onClick={() => {
          router.push("/");
        }}
      >
        <span className="text-blue-400">Work</span>
        <span className="text-gray-400">Hive</span>
      </div>
      <div className="flex items-center gap-4 text-gray-500">
        {token ? (
          <div className="flex items-center gap-2">
            <p>Hey {authState.user?.userId?.name}</p>
           <div className="rounded-full w-8 h-8 bg-gray-200 flex items-center justify-center">
            <img src={authState.user?.userId?.profilePicture} alt="Profile" className="w-8 h-8 rounded-full" />
            {/* {authState.user?.userId?.profilePicture} */}
           </div>
          
           {/* <button
            className="me-2 border rounded-xl p-1 px-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button> */}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p
              className="cursor-pointer me-2 border border-transparent  hover:bg-gray-200 rounded-full p-2 transition-all"
              onClick={() => {
                router.push("/login");
              }}
            >
              Join now
            </p>
            <p
              className="cursor-pointer hover:bg-gray-200 me-12 rounded-full border p-2 px-3 transition-all "
              onClick={() => {
                router.push("/login");
              }}
            >
              Sign In
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarComponent;
