import React from 'react'
import NavbarComponent from '../../components/Navbar/NavbarPage.jsx';
const UserLayout = ({children, token}) => {
  return (
    
    <div>
        <NavbarComponent token={token} />
       {children}</div>
  )
}

export default UserLayout