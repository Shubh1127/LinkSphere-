import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getAboutUser, logoutUser } from '@/config/redux/action/authAction'
import { useRouter } from 'next/router';
import { getAllPosts } from '@/config/redux/action/postAction';
export async function getServerSideProps({ req }) {
  const token = req.cookies?.token;
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return { props: {token} };
}



const Dashboard = ({token}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/");
  };

  useEffect(()=>{
    if(token){
      console.log("Token received in dashboard:", token);
      dispatch(getAllPosts())
      dispatch(getAboutUser())
    }
  },[token,dispatch])
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