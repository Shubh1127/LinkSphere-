import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
const Dashboard = () => {
    const router = useRouter();
    useEffect(()=>{
        if(!localStorage.getItem("token")){
            router.push('/login')
        }
    })
  return (
    <div>dashboard</div>
  )
}

export default Dashboard