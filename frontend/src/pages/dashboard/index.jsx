import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
const Dashboard = () => {
  const [visible,setVisible]=useState(true)
    const router = useRouter();
    useEffect(()=>{
        if(!localStorage.getItem("token")){
          setVisible(false)
          setTimeout(() => {
            router.push('/login')
          }, 500)
        }
    }, [router])
  return (
    <div className={`transition-opacity duration-500 ${visible? 'opacity-100': 'opacity-0'}`}>dashboard</div>
  )
}

export default Dashboard