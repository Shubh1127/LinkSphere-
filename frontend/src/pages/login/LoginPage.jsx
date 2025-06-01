import UserLayout from '@/layout/UserLayout/UserPage'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

function LoginComponent() {
  const authState=useSelector((state)=>state.auth)
  const router=useRouter();
  useEffect(()=>{
    if(authState.loggedIn){
      router.push ('/dashboard')
    }
  })
  return (
    <UserLayout>
    <div>Login</div>
    </UserLayout>
  )
}

export default LoginComponent