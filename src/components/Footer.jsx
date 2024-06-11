import React from 'react'

const Footer = () => {
  return (
    <div className='z-10 h-16 sm:h-14 fixed bottom-0 bg-[#1e0823] border-t border-pink-300 px-1 xsm:px-2 sm:px-4 py-1 xsm:py-2 w-full text-pink-100 flex flex-col justify-center items-center tracking-tighter text-center text-[11px] xsm:text-sm sm:text-base'>
      <div className='flex flex-wrap justify-center items-center gap-1'>
        <p>This is the Week 2 Assignment</p>
        <p>-</p>
        <p>"To-do-list Application" for</p>
        <p
          className='cursor-pointer font-bold underline underline-offset-4 hover:text-pink-300 transition-colors duration-300'
          onClick={()=>{window.open(`https://celebaltech.com`, '_blank')}}
        >Celebal Technologies</p>
        <p>Summer Internship</p>
      </div>
      <div className='flex flex-row gap-1 flex-wrap justify-center'>
        <span className=''>Developed by</span> 
        <span 
          className='cursor-pointer font-bold underline underline-offset-4 hover:text-pink-300 transition-colors duration-300'
          onClick={()=>{window.open(`https://bodhisatta1999.netlify.app/`, '_blank')}} 
        >Bodhisatta Bhattacharjee</span>
      </div>
    </div>
  )
}

export default Footer