import React from 'react'
import { assets } from '../assets/assets'

const LeaveReset = () => {
  return (
    <div className='min-h-screen w-full m-auto bg-cover bg-center overflow-hidden relative pt-[6rem]' 
    style={{backgroundImage: "url('/about_background.jpg')"}} 
    id='ForgotPwd'>
        <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-0"></div>
        
        <div className='z-0 relative'>
            <div className='w-[400px] m-auto p-6 mt-3 mb-5 bg-white bg-opacity-70 rounded-lg text-black text-center flex flex-col items-center justify-center'>
                <img src={assets.green_tick} alt='green tick icon' width={60} height={60} className='object-contain'/>
                <h3 className='font-semibold'>
                    Password Changed!
                </h3>
                <p className='text-sm'>
                    Your password has been changed successfully. 
                    Please go to login page and enter your credential again to login.
                </p>
            </div>
        </div>

    </div>
  )
}

export default LeaveReset