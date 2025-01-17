import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'

const Nav = () => {
    // react hook with boolean initialisation
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    // prevent website from scrolling when shoeMobileMenu is true
    useEffect(() => {
      if(showMobileMenu){
        document.body.style.overflow = 'hidden'
      }else {
        document.body.style.overflow = 'auto'
      }
      return () => {
        document.body.style.overflow = 'auto'
      }
    }, [showMobileMenu])

    
  return (
    <div className='absolute top-0 left-0 w-full z-20'>
        <div className='container mx-auto flex justify-between items-center py-4 px-6 md:px-20 lg:px-32 bg-transparent'>

            <img src={assets.logo} alt='logo' width={100} height={100} className='object-contain'/>

            <ul className='hidden md:flex gap-8 text-black font-semibold font-sans'>
                <a href='#Header'  className='cursor-pointer hover:text-gray-400'>Home</a>
                <a href='#About' className='cursor-pointer hover:text-gray-400'>About</a>
                <a href='#Destinations' className='cursor-pointer hover:text-gray-400'>Destinations</a>
                <a href='#Testimonials' className='cursor-pointer hover:text-gray-400'>Testimonials</a>
            </ul>
            
            <button className='hidden md:block bg-white px-6 py-2 rounded-full'>
              Sign Up
            </button>

            <img onClick={() => setShowMobileMenu(true)} src={assets.hamburger} alt='menu hamburger' width={30} height={30} className='md:hidden cursor-pointer'/>
        </div> 

        {/* mobile menu */}
        <div className={`md:hidden ${showMobileMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 overflow-hidden bg-white bg-opacity-80 transition-all`}>
          <div className='flex justify-end p-5 cursor-pointer'>
            <img onClick={() => setShowMobileMenu(false)} src={assets.cross} alt='cross icon' width={25} height={25}/>
          </div>

          <ul className='flex flex-col items-center gap-1 mt-5 px-5 font-semibold font-sant'>
            <a onClick={() => setShowMobileMenu(false)} href='#Header' className='px-4 py-2 rounded-full inline-block'>Home</a>
            <a onClick={() => setShowMobileMenu(false)} href='#About' className='px-4 py-2 rounded-full inline-block'>About</a>
            <a onClick={() => setShowMobileMenu(false)} href='#Destinations' className='px-4 py-2 rounded-full inline-block'>Destinations</a>
            <a onClick={() => setShowMobileMenu(false)} href='#Testimonials' className='px-4 py-2 rounded-full inline-block'>Testimonials</a>
          </ul>
        </div>
    </div>
  )
}

export default Nav