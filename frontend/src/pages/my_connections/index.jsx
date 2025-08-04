import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout/UserPage";

export async function getServerSideProps({ req }) {
  const token = req.cookies?.token || null;
  return { props: { token } };
}

export default function MyConnections({ token }) {
  return (
    <UserLayout token={token}>
      <DashboardLayout token={token}>
        <h1>My Connections</h1>
      </DashboardLayout>
    </UserLayout>
  );
}
