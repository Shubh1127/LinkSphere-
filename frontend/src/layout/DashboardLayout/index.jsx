import { setTokenIsThere } from "@/config/redux/reducer/authReducer";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function DashboardLayout({ children, token }) {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  //   console.log("authState data in dashboardlayout",authState)
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      router.push("/");
    }
    dispatch(setTokenIsThere());
  });
  return (
    <div className=" flex  w-full mt-5 gap-2">
      <div className="homeContainer ">
        <div className="homeContainer_leftBar flex items-start ps-6 py-2  flex-col gap-4 w-[15vw] ">
          <div
            onClick={() => router.push("/dashboard")}
            className="flex gap-2 cursor-pointer scale-100 hover:scale-110 transition-transform duration-200 ease-in-out"
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
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Scroll
          </div>
          <div
            onClick={() => router.push("/discover")}
            className="flex gap-2 cursor-pointer scale-100 hover:scale-110 transition-transform duration-200 ease-in-out"
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            Discover
          </div>
          <div
            onClick={() => router.push("/my_connections")}
            className="flex gap-2 cursor-pointer scale-100 hover:scale-110 transition-transform duration-200 ease-in-out"
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
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
            My Connections
          </div>
        </div>
      </div>
      <div className="feedContainer  flex-1">{children}</div>
      <div className="extraContainer flex flex-col   flex-[0.5] ms-12 justify-between">
        <h1 className="font-semibold mb-2 ms-2">Top Profiles</h1>
        {authState.all_profiles_fetched &&
          authState.all_users.map((profile) => {
            return (
              <div>
                <div className="w-max p-1 px-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 cursor-pointer scale-100 hover:scale-110 transition-transform duration-75 ease-in-out">
                  {profile.userId?.profilePicture ? (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                      alt="Default Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <img
                      src={profile.userId?.profilePicture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <p>{profile.userId.name}</p>
                  <p className="text-sm text-gray-500">
                    @{profile.userId?.username}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
