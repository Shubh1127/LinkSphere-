import { setTokenIsThere } from "@/config/redux/reducer/authReducer";
import { getAllUsers } from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// export async function getServerSideProps({ req }) {
//   const token = req.cookies.token || null;

//   if (!token) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   return { props: { token } };
// }


export default function DashboardLayout({ children }) {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { topProfiles } = useSelector((s) => s.auth || {});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  useEffect(() => {
    // console.log("redirectng to dashboard",token);
    if (!router.isReady) return;
    // if (typeof token === "undefined") return;
    // if (!token) router.push("/");
    else dispatch(setTokenIsThere());
  }, [ router.isReady, dispatch]);

  useEffect(() => {
    if (!topProfiles || topProfiles.length === 0) {
      dispatch(getAllUsers());
    }
  }, [dispatch, topProfiles]);

  return (
    <div className="flex flex-col lg:flex-row w-full mt-5 gap-2 relative">
      {/* Mobile Navigation Toggle */}
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden"
        >
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
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      )}

      {/* Sidebar - Hidden on mobile unless toggled */}
      <div
        className={`homeContainer ${
          isMobile
            ? isSidebarOpen
              ? "fixed inset-0 z-40 bg-white pt-12"
              : "hidden"
            : ""
        }`}
      >
        <div className="homeContainer_leftBar flex items-start ps-6 py-2 flex-col gap-4 lg:w-[15vw] sticky top-15 h-max">
          {/* Close button for mobile sidebar */}
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-2 right-4 p-1"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <div
            onClick={() => {
              router.push("/dashboard");
              if (isMobile) setIsSidebarOpen(false);
            }}
            className="flex gap-2 cursor-pointer scale-100 hover:scale-110 transition-transform duration-200 ease-in-out text-sm lg:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5 lg:size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Home
          </div>
          <div
            onClick={() => {
              router.push("/discover");
              if (isMobile) setIsSidebarOpen(false);
            }}
            className="flex gap-2 cursor-pointer scale-100 hover:scale-110 transition-transform duration-200 ease-in-out text-sm lg:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5 lg:size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            Discover
          </div>
          <div
            onClick={() => {
              router.push("/my_connections");
              if (isMobile) setIsSidebarOpen(false);
            }}
            className="flex gap-2 cursor-pointer scale-100 hover:scale-110 transition-transform duration-200 ease-in-out text-sm lg:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5 lg:size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
            My Connections
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="feedContainer flex-1 px-2 lg:px-0 mt-12 lg:mt-0">
        {children}
      </div>

      {/* Right Sidebar - Hidden on mobile, shown on tablet and desktop */}
      {!isMobile && (
        <div className="h-max flex flex-col flex-[0.5] ms-13 justify-between mt-4 lg:mt-0 px-2 lg:px-0">
          <h1 className="font-semibold mb-2 ms-2 text-sm lg:text-base">
            Top Profiles
          </h1>
          {authState.all_profiles_fetched &&
            authState.all_users
              .filter(
                (profile) =>
                  profile.userId?._id !== authState?.user?.userId?._id
              )
              .map((profile) => {
                return (
                  <div key={profile.userId?._id} className="mb-2">
                    <div
                      onClick={() =>
                        router.push(`/u/${profile.userId?.username}`)
                      }
                      className="w-full p-1 px-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 cursor-pointer scale-100 hover:scale-105 transition-transform duration-75 ease-in-out"
                    >
                      {profile.userId?.profilePicture ? (
                        <img
                          src={profile.userId?.profilePicture}
                          alt="Profile"
                          className="w-6 h-6 lg:w-8 lg:h-8 rounded-full"
                        />
                      ) : (
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                          alt="Default Profile"
                          className="w-6 h-6 lg:w-8 lg:h-8 rounded-full"
                        />
                      )}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
                        <p className="text-xs lg:text-sm">
                          {profile.userId?.name}
                        </p>
                        <p className="text-xs text-gray-500 lg:text-sm">
                          @{profile.userId?.username}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      )}
    </div>
  );
}
