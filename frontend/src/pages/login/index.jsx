import UserLayout from "@/layout/UserLayout/UserPage";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const [isLoginMethod, setIsLoginMethod] = useState(false);
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  });
  return (
    <UserLayout>
      <div className="h-screen w-screen ">
        <div className="h-[70vh] sm:max-w-[60vw] sm:m-auto mx-[5vw] sm:mt-[10vh]   rounded-lg flex shadow-[30px_30px_60px_rgba(0,0,0,0.35)]">

          <div className=" flex-1 h-full">
            <p className="text-center text-lg font-bold mt-2">{isLoginMethod ? "Sign In" : "Sign up"}</p>
          </div>
          <div className=" h-full sm:w-1/3 bg-blue-800 rounded-r-md "></div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
