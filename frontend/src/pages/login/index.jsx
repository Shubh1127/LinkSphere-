import UserLayout from "@/layout/UserLayout/UserPage";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { loginUser,registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";
function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch=useDispatch();
  const [isLoginMethod, setIsLoginMethod] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[name,setName]=useState("");
  const[username,setUsername]=useState("");
  const[message,setMessage]=useState("");
   
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  },[authState.loggedIn]);


  const handleRegister=()=>{
    console.log("registering user",username,name,email,password)
      dispatch(registerUser({username,name,email,password}))
      if(authState.message?.message=='User already exist'){
        console.log("User already exist")
        setIsLoginMethod(true);
        setMessage("User already exist. Please Login.")
      }
   
  }
  useEffect(()=>{
    console.log(authState.message?.message)
    dispatch(emptyMessage());
  },[isLoginMethod])
  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push('/dashboard')
    }
  })
  const handleLogin=()=>{
    dispatch(loginUser({email,password}))
  }
  return (
    <UserLayout>
      <div className="h-screen w-screen ">
        <div className="h-[70vh] sm:max-w-[60vw] sm:m-auto mx-[5vw] sm:mt-[10vh]   rounded-lg flex shadow-[30px_30px_60px_rgba(0,0,0,0.35)]">
          <div className=" flex-1 h-full">
            <p className="text-center text-lg font-bold mt-2 w-4/5">
              {isLoginMethod ? "Sign In" : "Sign up"}
            </p>
            <div className="flex flex-col m-4 p-4 w-full h-full">
              {!isLoginMethod && 
              <div className="flex w-4/5 gap-2">
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 mb-4 w-1/2"
                  />
                <input
                  type="text"
                  placeholder="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-1/2 mb-4"
                />
              </div>
                }
              <input
                placeholder="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-4/5 mb-4"
              />
               <div className="relative w-4/5 mb-4">
                <input
                  placeholder="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={((e)=>setPassword(e.target.value))}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
                <div
                  className="absolute top-3 right-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5 text-gray-500" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>
              <div className="w-4/5">
              {
                isLoginMethod?
                <p  className={`text-center ${authState.isError? "text-red-500":"text-green-500"}`}>{message ||authState?.message?.message  }</p>
                :
                <p  className={`text-center ${authState.isError? "text-red-500":"text-green-500"}`}>{authState?.message?.message }</p>
              }
              </div>
              <div>
                {
                  isLoginMethod ? 
                  <p className="text-blue-500 text-right w-4/5 cursor-pointer" onClick={()=>setIsLoginMethod(!isLoginMethod)}>Don't have an account?</p> 
                  : 
                  <p className="text-blue-500 text-right w-4/5 cursor-pointer" onClick={()=>setIsLoginMethod(!isLoginMethod)}>Already have an account?</p>
                }
              </div>
              <div>
                {
                  isLoginMethod ? 
                  <button
                    className="bg-blue-800 cursor-pointer border-none text-white py-2 px-4 rounded-md transition-all duration-300 mt-2 w-4/5"
                    onClick={() => {
                      setMessage(""),
                      setEmail(""), 
                      setPassword(""),
                      handleLogin();
                    }}
                  >
                    Sign In
                  </button> 
                  : 
                  <button
                    className="bg-blue-800 cursor-pointer border-none text-white py-2 px-4 rounded-md transition-all duration-300 mt-2 w-4/5"
                    onClick={() => {
                      setName(""),
                      setUsername(""),
                      setEmail(""), 
                      setPassword(""),
                      handleRegister();
                    }}
                  >
                    Sign Up
                  </button>
                }
                
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/3 bg-blue-800 rounded-r-md sm:block hidden">
  <img
    className="w-full h-full object-cover"
    src="https://zdblogs.zohowebstatic.com/sites/social/journal/files/2021-04/linkedin-journal-illustration.png"
    alt="Illustration"
  />
</div> 
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
