import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { clientServer, BASE_URL } from "@/config";
import { logoutUser } from "@/config/redux/action/authAction";

const NavbarComponent = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [meLoading, setMeLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    // Hydrate from cookie on refresh (don’t depend on token prop)
    (async () => {
      try {
        if (authState?.user?.userId?._id) return; // already in Redux
        setMeLoading(true);
        const res = await clientServer.get("/user/public_profile/me", {
          withCredentials: true,
        });
        console.log("Fetched user data:", res.data);  
        if (!ignore) setMe(res.data?.user || null);
      } catch {
        if (!ignore) setMe(null);
      } finally {
        if (!ignore) setMeLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [authState?.user?.userId?._id]);

  const isLoggedIn =
    Boolean(authState.user?.userId?._id) || Boolean(me?._id);

  const displayUser = authState.user?.userId || me;

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            {/* <img
              src={`${BASE_URL}/${displayUser?.profilePicture || "default.jpg"}`}
              alt={displayUser?.username || "me"}
              className="w-8 h-8 rounded-full object-cover"
            /> */}
            <p>Hey {displayUser?.name || displayUser?.username}</p>

            <div
              className="relative rounded-full w-8 h-8 bg-gray-200 flex items-center justify-center"
              ref={dropdownRef}
            >
              <img
                onClick={() => setIsOpen(!isOpen)}
                src={`${BASE_URL}/${displayUser?.profilePicture || "default.jpg"}`}
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer object-cover"
              />
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

                    <button
                      onClick={handleLogout}
                      className="text-red-500 cursor-pointer "
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : meLoading ? (
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
        ) : (
          <div className="flex items-center gap-2">
            <p
              className="cursor-pointer me-2 border border-transparent  hover:bg-gray-200 rounded-full p-2 transition-all"
              onClick={() => router.push("/login")}
            >
              Join now
            </p>
            <p
              className="cursor-pointer hover:bg-gray-200 me-12 rounded-full border p-2 px-3 transition-all "
              onClick={() => router.push("/login")}
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
