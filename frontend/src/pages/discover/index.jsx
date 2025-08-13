import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout/UserPage";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export async function getServerSideProps({ req }) {
  const token = req.cookies?.token || null;
  return { props: { token } };
}

export default function Discover({ token }) {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profiles_fetched]);
  return (
    <UserLayout token={token}>
      <DashboardLayout token={token}>
        <div className="discoverContainer  flex justify-center">
          {/* <h1>Discover</h1> */}
          {/* Add your discover content here */}

          <label htmlFor="fileUpload" className="   w-[80%]  flex justify-center ">
            <div className="items-center py-2 h-[7vh] w-[50%] flex px-2 outline rounded-lg  justify-between ">
              <input
                type="text"
                // accept="image/*"
                // onChange={}
                className=""
                placeholder="Search for users"
                id="fileUpload"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 cursor-pointer"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </label>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
