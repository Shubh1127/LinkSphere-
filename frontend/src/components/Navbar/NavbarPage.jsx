import React from "react";
import { useRouter } from "next/router";
const NavbarComponent = () => {
  const router = useRouter();
  return (
    <div className="flex items-baseline justify-between m-4">
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
        <p
          className="cursor-pointer me-2 border border-transparent  hover:bg-gray-200 rounded-full p-2 transition-all"
          onClick={() => {
            router.push("/login");
          }}
        >
          Join now
        </p>
        <p
          className="cursor-pointer hover:bg-gray-200 me-12 rounded-full border p-2 px-3 transition-all "
          onClick={() => {
            router.push("/login");
          }}
        >
          Sign In
        </p>
      </div>
    </div>
  );
};

export default NavbarComponent;
