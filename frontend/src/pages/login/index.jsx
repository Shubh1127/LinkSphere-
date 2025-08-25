import UserLayout from "@/layout/UserLayout/UserPage";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";



function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoginMethod, setIsLoginMethod] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (authState.loggedIn) {
      console.log("checking authState",authState.loggedIn);
      // token? console.log("token exists") : console.log("token does not exist");
      window.location.href="/dashboard"
      // router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  const handleRegister = () => {
    console.log("registering user", username, name, email, password);
    dispatch(registerUser({ username, name, email, password }));
   
    if (authState.message?.message == "User already exists") {
      console.log("User already exist");
      setIsLoginMethod(true);
      setMessage("User already exist. Please Login.");
    }
  };
  useEffect(() => {
    console.log(authState.message?.message);
    dispatch(emptyMessage());
  }, [isLoginMethod]);
  const handleLogin = () => {
    dispatch(loginUser({ identifier: username, password }));
  };
  useEffect(() => {
    if (authState.message === "Registration successful") {
      setIsLoginMethod(true);
      setMessage("Registration successful. Please Login.");
    }
    if (authState.message?.message === "User already exists") {
      setIsLoginMethod(true);
      setMessage("User already exist. Please Login.");
    }
  }, [authState.message]);
  return (
    <UserLayout>
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row rounded-lg shadow-[30px_30px_60px_rgba(0,0,0,0.15)] bg-white overflow-hidden">
          <div className="flex-1 p-8 flex flex-col justify-center">
            <p className="text-center text-lg font-bold mt-2 w-4/5 flex flex-col">
              {isLoginMethod ? "Sign In" : "Sign up"}
              {authState.message==="Registration successful" && (
                <span className="text-green-500">{message}</span>
              )}
            </p>
            <div className="flex flex-col m-4 p-4 w-full h-full">
              {/* Sign Up fields */}
              {!isLoginMethod && (
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
              )}
              {/* Only show email input for Sign Up */}
              {!isLoginMethod && (
                <input
                  placeholder="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-4/5 mb-4"
                />
              )}
              {/* Only show Username or Email input for Sign In */}
              {isLoginMethod && (
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-4/5 mb-4"
                />
              )}
              {/* Password input for both */}
              <div className="relative w-4/5 mb-4">
                <input
                  placeholder="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={((e) => setPassword(e.target.value))}
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
                  isLoginMethod ?
                    <p className={`text-center ${authState.isError ? "text-red-500" : "text-green-500"}`}>{message || authState?.message?.message}</p>
                    :
                    <p className={`text-center ${authState.isError ? "text-red-500" : "text-green-500"}`}>{authState?.message?.message}</p>
                }
              </div>
              <div>
                {
                  isLoginMethod ?
                    <p className="text-blue-500 text-right w-4/5 cursor-pointer" onClick={() => setIsLoginMethod(!isLoginMethod)}>Don't have an account?</p>
                    :
                    <p className="text-blue-500 text-right w-4/5 cursor-pointer" onClick={() => setIsLoginMethod(!isLoginMethod)}>Already have an account?</p>
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
                          setUsername(""),
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
          <div className="sm:w-1/3 bg-blue-800 hidden sm:block">
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
