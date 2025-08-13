import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/config/redux/action/authAction";

const NavbarComponent = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef=useRef(null);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
  };
  console.log("Token in NavbarPage:", token);
  const router = useRouter();
  useEffect(()=>{
    const handleClickOutside=(event)=>{
      if(
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ){
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown",handleClickOutside);
    return ()=>{
      document.removeEventListener("mousedown",handleClickOutside);
    }
  },[]);
  
  return (
    <div className="flex items-baseline justify-between p-3 sticky top-0 z-50 bg-white ">
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
            <div className="relative rounded-full w-8 h-8 bg-gray-200 flex items-center justify-center" ref={dropdownRef}>
               {
                    !authState.userId?.profilePicture? <img 
                    onClick={() => setIsOpen(!isOpen)}
                    src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                    alt="Default Profile"
                    className="w-8 h-8 rounded-full cursor-pointer"
                />:
                  <img
                    onClick={() => setIsOpen(!isOpen)}
                    src={authState.userId?.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full cursor-pointer"
                  />}
              {isOpen && (
                <div className="absolute top-10 right-0 w-max p-1 bg-white border rounded-md shadow-lg">
                  <div className="flex gap-1 scale-100 hover:scale-110 hover:p-[0.1rem] transition-transform ease-in-out cursor-pointer">
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
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                      />
                    </svg>

                    <button onClick={handleLogout} className="text-red-500 cursor-pointer ">Logout</button>
                  </div>
                </div>
              )}
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
