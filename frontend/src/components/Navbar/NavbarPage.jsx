import React from 'react';
import { useRouter } from 'next/router';
const NavbarComponent = () => {
    const router=useRouter();
  return (
    <div className='font-bold m-3 cursor-pointer' onClick={()=>{router.push('/')}}>Pro Connect</div>
  );
};

export default NavbarComponent;