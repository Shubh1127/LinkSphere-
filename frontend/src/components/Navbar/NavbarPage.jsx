import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { clientServer, BASE_URL } from "@/config";
import { logoutUser } from "@/config/redux/action/authAction";

const NavbarComponent = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [meLoading, setMeLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    // Hydrate from cookie on refresh (don't depend on token prop)
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
    setIsOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between p-3 sticky top-0 z-50 bg-white shadow-sm">
      {/* Logo */}
      <div
        className="font-bold text-xl md:text-2xl ps-4 md:ps-12 cursor-pointer"
        onClick={() => {
          router.push("/");
        }}
      >
        <span className="text-blue-400">Work</span>
        <span className="text-gray-400">Hive</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4 text-gray-500">
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <p className="text-sm md:text-base">Hey {displayUser?.name || displayUser?.username}</p>

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
                <div className="absolute top-10 right-0 w-max p-2 bg-white border rounded-md shadow-lg z-50">
                  <div className="flex gap-2 items-center hover:bg-gray-100 p-2 rounded cursor-pointer transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                      />
                    </svg>

                    <button
                      onClick={handleLogout}
                      className="text-red-500 cursor-pointer text-sm"
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
              className="cursor-pointer me-2 border border-transparent hover:bg-gray-200 rounded-full p-2 transition-all text-sm"
              onClick={() => router.push("/login")}
            >
              Join now
            </p>
            <p
              className="cursor-pointer hover:bg-gray-200 me-12 rounded-full border p-2 px-3 transition-all text-sm"
              onClick={() => router.push("/login")}
            >
              Sign In
            </p>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center">
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
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
                <div className="absolute top-10 right-0 w-max p-2 bg-white border rounded-md shadow-lg z-50">
                  <div className="flex gap-2 items-center hover:bg-gray-100 p-2 rounded cursor-pointer transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                      />
                    </svg>

                    <button
                      onClick={handleLogout}
                      className="text-red-500 cursor-pointer text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-button p-2 ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
          </div>
        ) : meLoading ? (
          <div className="w-16 h-6 bg-gray-200 rounded animate-pulse mr-4" />
        ) : (
          <div className="flex items-center gap-2 mr-4">
            <p
              className="cursor-pointer border border-transparent hover:bg-gray-200 rounded-full p-1 px-2 transition-all text-sm"
              onClick={() => router.push("/login")}
            >
              Join
            </p>
            <p
              className="cursor-pointer hover:bg-gray-200 rounded-full border p-1 px-2 transition-all text-sm"
              onClick={() => router.push("/login")}
            >
              Sign In
            </p>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && isLoggedIn && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden absolute top-full left-0 right-0 bg-white border-t shadow-lg z-40 p-4"
        >
          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
            <img
              src={`${BASE_URL}/${displayUser?.profilePicture || "default.jpg"}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{displayUser?.name || displayUser?.username}</p>
              <p className="text-sm text-gray-500">@{displayUser?.username}</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 p-2 hover:bg-red-50 rounded transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarComponent;