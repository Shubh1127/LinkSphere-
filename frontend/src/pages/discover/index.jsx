import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout/UserPage";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { BASE_URL } from "@/config";

export async function getServerSideProps({ req }) {
  const token = req.cookies?.token || null;
  return { props: { token } };
}

export default function Discover({ token }) {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  // Local search UI state
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const boxRef = useRef(null);
  const debounceRef = useRef(null);

  // Fetch users for local filtering
  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profiles_fetched, dispatch]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced client-side filter
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const list =
        authState?.allUsers ||
        authState?.users ||
        authState?.profiles ||
        [];
      const q = query.trim().toLowerCase();
      if (!q) {
        setSuggestions([]);
        setOpen(false);
        setActiveIndex(-1);
        return;
      }
      const filtered = list
        .filter((u) => {
          const name = u?.name || "";
          const username = u?.username || "";
          const email = u?.email || "";
          return (
            name.toLowerCase().includes(q) ||
            username.toLowerCase().includes(q) ||
            email.toLowerCase().includes(q)
          );
        })
        .slice(0, 8); // show top 8
      setSuggestions(filtered);
      setOpen(true);
      setActiveIndex(filtered.length ? 0 : -1);
    }, 200);
    return () => clearTimeout(debounceRef.current);
  }, [query, authState?.allUsers, authState?.users, authState?.profiles]);

  const goToProfile = (user) => {
    if (!user) return;
    setOpen(false);
    setActiveIndex(-1);
    setQuery("");
    router.push(`/u/${user.username}`);
  };

  return (
    <UserLayout token={token}>
      <DashboardLayout token={token}>
        <div className="discoverContainer flex justify-center">
          <div className="w-[80%] flex justify-center">
            <div ref={boxRef} className="relative w-[50%]">
              <div className="flex items-center gap-2 px-2 outline rounded-lg">
                <input
                  type="text"
                  className="flex-1 py-2 outline-none"
                  placeholder="Search for users"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length) setOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (!open || !suggestions.length) return;
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveIndex((i) =>
                        i + 1 >= suggestions.length ? 0 : i + 1
                      );
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex((i) =>
                        i - 1 < 0 ? suggestions.length - 1 : i - 1
                      );
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      goToProfile(suggestions[activeIndex]);
                    } else if (e.key === "Escape") {
                      setOpen(false);
                      setActiveIndex(-1);
                    }
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 cursor-pointer text-gray-600"
                  onClick={() => {
                    if (suggestions.length) goToProfile(suggestions[0]);
                  }}
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {open && (
                <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow z-50">
                  {suggestions.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No users found
                    </div>
                  ) : (
                    suggestions.map((u, idx) => {
                      const isActive = idx === activeIndex;
                      return (
                        <div
                          key={u._id || u.username || idx}
                          className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
                            isActive ? "bg-gray-100" : "hover:bg-gray-50"
                          }`}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onMouseDown={(e) => e.preventDefault()} // keep focus for click
                          onClick={() => goToProfile(u)}
                        >
                          <img
                            src={`${BASE_URL}/${u.profilePicture}`}
                            alt={u.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">
                              {u.name || u.username}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              @{u.username} {u.email ? `• ${u.email}` : ""}
                            </div>
                          </div>
                          {/* Optional: quick link */}
                          <Link
                            href={`/u/${u.username}`}
                            onClick={(e) => e.stopPropagation()}
                            className="ml-auto text-xs text-blue-600 hover:underline"
                          >
                            View
                          </Link>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
