import UserLayout from "@/layout/UserLayout/UserPage";
import Head from "next/head";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";


export async function getServerSideProps({req}){
  const token=req.cookies?.token || null;
  return {props:token}
}


export default function Home({props:token}) {
  const dispatch=useDispatch();
  const authState = useSelector((s) => s.auth);
  const router = useRouter();

  useEffect(()=>{
    if(!authState.loggedIn && token){
      dispatch(getAboutUser());
      // console.log("User is not logged in but token is present");
    }
  }, [authState.loggedIn, dispatch, token]);

  useEffect(() => {
    console.log("Checking if user is logged in");
    console.log("authState:", authState);
    if (authState.loggedIn) {
      console.log("User is logged in");
      router.push("/dashboard");
    }
  }, [authState.loggedIn, router]);

  return (
    <UserLayout>
      <Head>
        <title>WorkHive</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/LinkedIn_icon_circle.svg/1200px-LinkedIn_icon_circle.svg.png"
        />
      </Head>
      <div className="w-full min-h-screen flex flex-col md:flex-row px-4 md:px-12 justify-center items-center">
        {/* Left Content Section */}
        <div className="w-full md:min-w-[40vw] mt-4 md:mt-[10vh] h-full flex items-center justify-center md:justify-between">
          <div className="w-full max-w-md md:max-w-none">
            <div>
              <p className="text-3xl md:text-5xl lg:text-[4rem] w-full md:w-[40vw] text-center md:text-left">
                Welcome to your professional community
              </p>
            </div>
            <div className="flex flex-col m-2 md:m-4 p-2 md:p-4 w-full h-full gap-3">
              <div className="h-max border w-full md:w-[20vw] text-center p-2 md:p-1 rounded-2xl bg-blue-400 text-white cursor-pointer hover:bg-blue-300 flex items-center justify-center">
                <span className="bg-white rounded-full py-1 px-1 mx-1 flex items-center">
                  <FcGoogle className="inline-block" />
                </span>
                <span className="ml-2">Continue with Google</span>
              </div>
              <div 
                onClick={() => router.push('/login')} 
                className="h-max border w-full md:w-[20vw] text-center hover:bg-gray-200 cursor-pointer p-2 md:p-1 rounded-2xl"
              >
                Sign in with email
              </div>
              <div className="text-center text-xs md:text-sm text-gray-400 max-w-full md:max-w-[20vw]">
                By clicking Continue to join or sign in, you agree to WorkHive's&nbsp;
                <span className="text-blue-500 font-bold cursor-pointer hover:underline">
                  User Agreement
                </span>
                <span>,&nbsp;</span>
                <span className="text-blue-500 font-bold cursor-pointer hover:underline">
                  Privacy Policy
                </span>
                <span>,&nbsp;and&nbsp;</span>
                <span className="text-blue-500 font-bold cursor-pointer hover:underline">
                  Cookie Policy.
                </span>
              </div>
            </div>
            <div className="text-center w-full md:w-[24vw] text-sm md:text-md mb-6 md:mb-0">
              <button onClick={() => router.push('/login')}>
                New to WorkHive?{" "}
                <span className="text-blue-500 font-bold cursor-pointer hover:underline">
                  Join now
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Image Section - Hidden on small screens */}
        <div className="hidden md:flex min-w-[30vw] h-full mt-[10vh] items-center justify-center">
          <img 
            src="/image.svg" 
            style={{ width: "700px", height: "500px" }} 
            alt="Professional community illustration" 
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </UserLayout>
  );
}