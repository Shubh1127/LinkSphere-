import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/config/redux/action/authAction'
const Dashboard = () => {
  const dispatch=useDispatch();
  const [visible,setVisible]=useState(true)
    const router = useRouter();
    console.log(Cookies.get("token"))
    useEffect(()=>{
        if(!Cookies.get("token")){
          setVisible(false)
          setTimeout(() => {
            router.push('/login')
          }, 500)
        }
    }, [router])
  return (
    <div className={`transition-opacity duration-500 ${visible? 'opacity-100': 'opacity-0'}`}>
    <div  className='flex items-baseline justify-between m-4'>
      <p>Dashboard</p>
      <button className='me-2 border rounded-xl p-1 px-2 hover:bg-gray-100 cursor-pointer' onClick={()=>dispatch(logoutUser())}>Logout</button>
    </div>
      </div>
  )
}

export default Dashboard