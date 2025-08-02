import React from 'react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/config/redux/action/authAction'
import { useRouter } from 'next/router';
export async function getServerSideProps({ req }) {
  const token = req.cookies?.token;
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: {} };
}



const Dashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
  };
  return (
    <div className="transition-opacity duration-500 opacity-100">
      <div className='flex items-baseline justify-between m-4'>
        <p>Dashboard</p>
        <button
          className='me-2 border rounded-xl p-1 px-2 hover:bg-gray-100 cursor-pointer'
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;