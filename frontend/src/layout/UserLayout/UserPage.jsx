import React from 'react'
import NavbarComponent from '../../components/Navbar/NavbarPage';
const UserLayout = ({children}) => {
  return (
    
    <div>
        <NavbarComponent />
       {children}</div>
  )
}

export default UserLayout