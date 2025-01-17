import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom';

const Footer = () => {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0
        })
    }

  return (
    <div className='w-full bg-gray-800 text-white mx-auto'>
        <div className='z-10 relative grid grid-cols-1 lg:grid-cols-3 p-10 md:p-15 gap-5'>

            <div>
                <div className='flex flex-row gap-5'>
                    <Link to='/' onClick={scrollToTop} className='cursor-pointer'>
                        <img src={assets.logo} alt='logo' width={60} height={60} className='object-contain'/>
                    </Link>
                    <h3 className='mt-3 text-white font-bold font-sans'>
                        Malaysia Adventure
                    </h3>
                </div>

                <p className='text-gray-300 mt-5 max-w-sm'>
                    We are a team of experienced tour guides who are passionate about adventure and travel. 
                    Our goal is to make your trip as memorable as possible.
                </p>
            </div>

            <div>
                <h3 className='text-white font-bold font-sans mt-3'>
                    Contact Us
                </h3>

                <ul className='text-gray-300 mt-5 max-w-sm'>
                    <li>Email: malaysiaadventure@gmail.com</li>
                    <li>Phone: +60123456789</li>
                    <li>Location: Kuala Lumpur, Malaysia</li>
                </ul>

            </div>

            <div>
                <h3 className='text-white font-bold font-sans mt-3'>
                    Social Share
                </h3>

                <div className='flex flex-row gap-5 mt-5'>
                    <a href='#Facebook' className='cursor-pointer'>
                        <img src={assets.facebook} width={40} className='rounded-full object-contain'/>
                    </a>

                    <a href='#Instagram' className='cursor-pointer'>
                        <img src={assets.instagram} width={40} className='rounded-full object-contain'/>
                    </a>

                    <a href='#Twitter' className='cursor-pointer'>
                        <img src={assets.twitter} width={40} className='rounded-full object-contain'/>
                    </a>

                    <a href='#Youtube' className='cursor-pointer'>
                        <img src={assets.youtube} width={40} className='rounded-full object-contain'/>
                    </a>

                </div>

            </div>


        </div>

        <div className='py-2 mt-3 text-center text-gray-300'>
            Copyright 2024 @ Malaysia Adventure. All Right Reserved.
        </div>
    </div>
  )
}

export default Footer