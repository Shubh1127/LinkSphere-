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
        <div className="discoverContainer">
          <h1>Discover</h1>
          {/* Add your discover content here */}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}