import UserLayout from "@/layout/UserLayout/UserPage";
import Head from "next/head";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
// import Styles from '@/styles/Home.module.css'
// import Styles2 from '@/styles/Home.module.css'
export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <Head>
        <title>WorkHive</title>
        <link
          rel="icon"
          href="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/LinkedIn_icon_circle.svg/1200px-LinkedIn_icon_circle.svg.png"
        />
      </Head>
      <div className="w-full h-[50vh] flex px-12 justify-center">
        <div className="min-w-[40vw] mt-[10vh] h-full flex items-center justify-between">
          <div>
            <div>
              <p className="text-[4rem]  w-[40vw]">
                Welcome to your professional community
              </p>
            </div>
            <div className="flex flex-col m-4 p-4 w-full h-full gap-3">
              <div className="h-[4vh] border w-[20vw] text-center  p-1 rounded-2xl bg-blue-400 text-white cursor-pointer hover:bg-blue-300 ">
                <span className=" bg-white rounded-full  pb-1 px-1 mx-1">
                  <FcGoogle className="inline-block" />
                </span>
                Continue with Google
              </div>
              <div onClick={()=>router.push('/login')} className="h-max border w-[20vw] text-center hover:bg-gray-100 cursor-pointer p-1 rounded-2xl ">
                Sign in with email
              </div>
              <p className="text-center text-sm text-gray-400 max-w-[20vw]">
                By clicking Continue to join or sign in, you agree to LinkedIn’s{" "}
                <span className="text-blue-500 font-bold cursor-pointer hover:underline">
                  User Agreement 
                </span>
                ,
                <span className="text-blue-500 font-bold cursor-pointer hover:underline">
                   Privacy Policy
                </span>
                , and
                <span className="text-blue-500 font-bold cursor-pointer hover:underline">
                   Cookie Policy.
                </span>
              
              </p>
             
            </div>
             <div className=" text-center w-[24vw] text-md ">
              <button onClick={()=> router.push('/login')}>
                New to WorkHive?{" "}
                <span className="text-blue-500 font-bold cursor-pointer hover:underline">
                  Join now
                </span>
              </button>
            </div>
          </div>
          
        </div>

        <div className="min-w-[30vw] h-full mt-[10vh]  flex items-center justify-center">
          <img src="image.svg" style={{ width: "700px", height: "500px" }} />
        </div>
      </div>
    </UserLayout>
  );
}
