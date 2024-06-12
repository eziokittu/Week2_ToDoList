import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className='fixed top-0 z-20 w-full h-10 flex items-center bg-[#1e0823] text-pink-100 border-b border-pink-300'>
      <div className='w-full mx-auto sm:w-[675px] md:w-[810px] lg:w-[1024px] flex justify-between items-center px-1 xsm:px-4'>
        <div 
          className='cursor-pointer'
          onClick={() => { window.open(`https://celebaltech.com/`, '_blank') }}
        >
          <img 
            className='h-8' 
            src="/logo.webp" 
            alt="Celebal Technologies" 
          />
        </div>
        <div>My To-do lists</div>
      </div>
    </div>
  );
}

export default Navbar;